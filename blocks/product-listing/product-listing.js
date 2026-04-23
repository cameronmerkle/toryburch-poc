import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Adobe I/O Runtime API configuration.
 *
 * In production, the ACTION_URL would point to your deployed Adobe I/O Runtime action:
 *   https://[namespace].adobeioruntime.net/api/v1/web/commerce-proxy/get-products
 *
 * The action acts as a secure proxy between the browser and Adobe Commerce,
 * handling authentication, caching, and response shaping.
 */
const COMMERCE_API = {
  // Replace with your Adobe I/O Runtime action URL
  actionUrl: 'https://your-namespace.adobeioruntime.net/api/v1/web/commerce-proxy/get-products',

  // For local development / demo, use mock data
  useMock: true,
};

/**
 * Mock product data for local development.
 * In production, this comes from Adobe Commerce via Adobe I/O Runtime.
 */
function getMockProducts(category) {
  const catalog = {
    handbags: [
      {
        sku: 'TB-154706',
        name: 'Kira Chevron Small Flap Shoulder Bag',
        price: 498,
        image: 'https://s7d2.scene7.com/is/image/Tory/style/media/catalog/product/bag/kira-chevron-small-flap-shoulder-bag-placeholder.jpg',
        url: '/products/kira-chevron-small-flap-shoulder-bag',
        color: 'Black',
        badge: '',
      },
      {
        sku: 'TB-156219',
        name: 'Fleming Soft Convertible Shoulder Bag',
        price: 548,
        image: 'https://s7d2.scene7.com/is/image/Tory/style/media/catalog/product/bag/fleming-soft-convertible-shoulder-bag-placeholder.jpg',
        url: '/products/fleming-soft-convertible-shoulder-bag',
        color: 'New Cream',
        badge: 'New',
      },
      {
        sku: 'TB-160043',
        name: 'Lee Radziwill Double Bag',
        price: 998,
        image: 'https://s7d2.scene7.com/is/image/Tory/style/media/catalog/product/bag/lee-radziwill-double-bag-placeholder.jpg',
        url: '/products/lee-radziwill-double-bag',
        color: 'Brown',
        badge: '',
      },
      {
        sku: 'TB-162587',
        name: 'Robinson Crossbody',
        price: 348,
        salePrice: 278,
        image: 'https://s7d2.scene7.com/is/image/Tory/style/media/catalog/product/bag/robinson-crossbody-placeholder.jpg',
        url: '/products/robinson-crossbody',
        color: 'Cardamom',
        badge: 'Sale',
      },
    ],
    shoes: [
      {
        sku: 'TB-148289',
        name: 'Good Luck Trainer',
        price: 298,
        image: 'https://s7d2.scene7.com/is/image/Tory/style/media/catalog/product/shoes/good-luck-trainer-placeholder.jpg',
        url: '/products/good-luck-trainer',
        color: 'White / Green',
        badge: 'Bestseller',
      },
      {
        sku: 'TB-150912',
        name: 'Cap-Toe Ballet Flat',
        price: 268,
        image: 'https://s7d2.scene7.com/is/image/Tory/style/media/catalog/product/shoes/cap-toe-ballet-flat-placeholder.jpg',
        url: '/products/cap-toe-ballet-flat',
        color: 'Perfect Black',
        badge: '',
      },
      {
        sku: 'TB-155833',
        name: 'Eleanor Loafer',
        price: 398,
        image: 'https://s7d2.scene7.com/is/image/Tory/style/media/catalog/product/shoes/eleanor-loafer-placeholder.jpg',
        url: '/products/eleanor-loafer',
        color: 'Whiskey',
        badge: 'New',
      },
      {
        sku: 'TB-158401',
        name: 'Bubble Jelly Sandal',
        price: 128,
        salePrice: 89,
        image: 'https://s7d2.scene7.com/is/image/Tory/style/media/catalog/product/shoes/bubble-jelly-sandal-placeholder.jpg',
        url: '/products/bubble-jelly-sandal',
        color: 'Meadow Mist',
        badge: 'Sale',
      },
    ],
  };

  return catalog[category] || catalog.handbags;
}

/**
 * Fetches products from Adobe I/O Runtime action.
 *
 * The Runtime action handles:
 * - Authenticating with Adobe Commerce using stored credentials
 * - Executing a GraphQL query against the Commerce catalog
 * - Caching the response (typically 5-min TTL)
 * - Transforming the response into a lightweight JSON payload
 * - Setting CORS headers for the EDS domain
 *
 * @param {string} category - The product category to fetch
 * @returns {Promise<Array>} Array of product objects
 */
async function fetchProducts(category) {
  if (COMMERCE_API.useMock) {
    // Simulate network latency for realistic dev experience
    await new Promise((resolve) => { setTimeout(resolve, 300); });
    return getMockProducts(category);
  }

  const resp = await fetch(`${COMMERCE_API.actionUrl}?category=${encodeURIComponent(category)}`, {
    headers: { Accept: 'application/json' },
  });

  if (!resp.ok) {
    throw new Error(`Commerce API error: ${resp.status}`);
  }

  return resp.json();
}

/**
 * Renders a single product card.
 * @param {Object} product - Product data from the API
 * @returns {HTMLElement} The product card element
 */
function renderProductCard(product) {
  const li = document.createElement('li');
  li.className = 'product-listing-card';
  li.dataset.sku = product.sku;

  const hasDiscount = product.salePrice && product.salePrice < product.price;

  li.innerHTML = `
    <a href="${product.url}" class="product-listing-card-link" aria-label="${product.name}">
      <div class="product-listing-card-image">
        ${product.badge ? `<span class="product-listing-badge product-listing-badge-${product.badge.toLowerCase()}">${product.badge}</span>` : ''}
        <picture>
          <img src="${product.image}" alt="${product.name}" loading="lazy" width="374" height="425" />
        </picture>
      </div>
      <div class="product-listing-card-body">
        <p class="product-listing-card-name">${product.name}</p>
        <p class="product-listing-card-color">${product.color}</p>
        <p class="product-listing-card-price">
          ${hasDiscount
    ? `<span class="product-listing-price-original">$${product.price}</span>
               <span class="product-listing-price-sale">$${product.salePrice}</span>`
    : `<span>$${product.price}</span>`}
        </p>
      </div>
    </a>
  `;

  // Optimize images for EDS pipeline
  const img = li.querySelector('img');
  if (img) {
    const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimized);
  }

  return li;
}

/**
 * Loads and decorates the product-listing block.
 *
 * Content model (what authors create in the document):
 * ┌──────────────────────────────┐
 * │ Product Listing              │  ← block name
 * ├──────────────────────────────┤
 * │ handbags                     │  ← category (row 1)
 * ├──────────────────────────────┤
 * │ 4                            │  ← columns on desktop (row 2, optional)
 * └──────────────────────────────┘
 *
 * The author simply types a category name, and the block fetches
 * live product data from Adobe Commerce via Adobe I/O Runtime.
 *
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  // Extract authored configuration
  const rows = [...block.children];
  const category = rows[0]?.textContent?.trim().toLowerCase() || 'handbags';
  const columns = parseInt(rows[1]?.textContent?.trim(), 10) || 4;

  // Clear authored content
  block.textContent = '';

  // Show loading state
  const loader = document.createElement('div');
  loader.className = 'product-listing-loader';
  loader.setAttribute('aria-label', 'Loading products');
  loader.innerHTML = '<p>Loading products...</p>';
  block.append(loader);

  // Set grid columns as CSS custom property
  block.style.setProperty('--product-columns', columns);

  try {
    // Fetch from Adobe I/O Runtime → Adobe Commerce
    const products = await fetchProducts(category);

    // Remove loader
    loader.remove();

    // Render product grid
    const ul = document.createElement('ul');
    ul.className = 'product-listing-grid';
    ul.setAttribute('role', 'list');

    products.forEach((product) => {
      ul.append(renderProductCard(product));
    });

    block.append(ul);
  } catch (error) {
    // Graceful degradation — show message, don't break the page
    loader.innerHTML = '<p class="product-listing-error">Unable to load products. Please try again later.</p>';
    // eslint-disable-next-line no-console
    console.error('Product listing fetch failed:', error);
  }
}
