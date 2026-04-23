/**
 * Adobe I/O Runtime Action: Commerce Product Proxy
 *
 * This file is a REFERENCE IMPLEMENTATION — it does NOT run inside EDS.
 * It would be deployed to Adobe I/O Runtime as a serverless action.
 *
 * Deploy with:
 *   aio app deploy
 *
 * The action serves as a secure proxy between the EDS browser client
 * and Adobe Commerce (Magento) GraphQL API.
 *
 * Architecture:
 *   Browser (EDS Block) → Adobe I/O Runtime → Adobe Commerce GraphQL
 *
 * Responsibilities:
 *   1. Authentication — Commerce API credentials are stored as action params
 *      (never exposed to the browser)
 *   2. CORS — Sets proper headers so EDS domains can call this action
 *   3. Caching — Implements a TTL cache to reduce Commerce API load
 *   4. Transformation — Reshapes verbose GraphQL responses into lightweight
 *      JSON payloads optimized for the EDS block
 *   5. Error handling — Returns clean error responses to the client
 */

// Simple in-memory cache (in production, use Adobe I/O State or Redis)
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * GraphQL query for Adobe Commerce product catalog.
 * Fetches only the fields needed by the EDS block.
 */
const PRODUCTS_QUERY = `
  query GetProducts($categoryId: String!, $pageSize: Int!) {
    products(
      filter: { category_id: { eq: $categoryId } }
      pageSize: $pageSize
      sort: { position: ASC }
    ) {
      items {
        sku
        name
        url_key
        price_range {
          minimum_price {
            regular_price { value currency }
            final_price { value currency }
            discount { amount_off percent_off }
          }
        }
        small_image { url label }
        custom_attributes {
          attribute_code
          value
        }
      }
      total_count
    }
  }
`;

/**
 * Maps a Commerce category slug to a category ID.
 * In production, this could be a lookup table or a separate GraphQL call.
 */
const CATEGORY_MAP = {
  handbags: '24',
  shoes: '30',
  clothing: '36',
  accessories: '42',
  sale: '99',
};

/**
 * Transforms a Commerce GraphQL product into the lightweight
 * shape expected by the EDS block.
 */
function transformProduct(item) {
  const price = item.price_range.minimum_price;
  const hasDiscount = price.discount && price.discount.amount_off > 0;

  // Extract color from custom attributes
  const colorAttr = item.custom_attributes?.find(
    (attr) => attr.attribute_code === 'color',
  );

  return {
    sku: item.sku,
    name: item.name,
    price: price.regular_price.value,
    salePrice: hasDiscount ? price.final_price.value : undefined,
    image: item.small_image.url,
    url: `/products/${item.url_key}`,
    color: colorAttr?.value || '',
    badge: hasDiscount ? 'Sale' : '',
  };
}

/**
 * Main action entry point.
 *
 * @param {Object} params - Action parameters (includes both invocation params
 *                          and bound credentials from app.config.yaml)
 * @param {string} params.COMMERCE_URL - Adobe Commerce GraphQL endpoint
 * @param {string} params.COMMERCE_AUTH_TOKEN - Bearer token for Commerce API
 * @param {string} params.ALLOWED_ORIGINS - Comma-separated allowed CORS origins
 * @param {string} params.category - Product category slug (from query string)
 * @param {number} [params.pageSize=12] - Number of products to return
 */
async function main(params) {
  // --- CORS Headers ---
  const allowedOrigins = (params.ALLOWED_ORIGINS || '').split(',');
  const origin = params.__ow_headers?.origin || '';
  const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

  const corsHeaders = {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Access-Control-Max-Age': '86400',
  };

  // Handle preflight
  if (params.__ow_method === 'options') {
    return { statusCode: 204, headers: corsHeaders };
  }

  try {
    const category = (params.category || 'handbags').toLowerCase();
    const pageSize = parseInt(params.pageSize, 10) || 12;
    const categoryId = CATEGORY_MAP[category];

    if (!categoryId) {
      return {
        statusCode: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: { error: `Unknown category: ${category}` },
      };
    }

    // --- Check Cache ---
    const cacheKey = `${category}-${pageSize}`;
    const cached = cache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
      return {
        statusCode: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300',
          'X-Cache': 'HIT',
        },
        body: cached.data,
      };
    }

    // --- Fetch from Adobe Commerce ---
    const response = await fetch(params.COMMERCE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${params.COMMERCE_AUTH_TOKEN}`,
      },
      body: JSON.stringify({
        query: PRODUCTS_QUERY,
        variables: { categoryId, pageSize },
      }),
    });

    if (!response.ok) {
      throw new Error(`Commerce API returned ${response.status}`);
    }

    const graphqlResult = await response.json();

    if (graphqlResult.errors) {
      throw new Error(graphqlResult.errors[0].message);
    }

    // --- Transform Response ---
    const products = graphqlResult.data.products.items.map(transformProduct);

    // --- Update Cache ---
    cache.set(cacheKey, { data: products, timestamp: Date.now() });

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300',
      },
      body: products,
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: { error: 'Failed to fetch products', detail: error.message },
    };
  }
}

exports.main = main;
