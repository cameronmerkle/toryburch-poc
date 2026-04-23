/**
 * Product Details Block — Commerce Dropin Integration Pattern
 *
 * This block demonstrates how Adobe Commerce Dropins integrate with EDS.
 * Dropins are pre-built, customizable UI micro-frontends that connect
 * directly to Adobe Commerce via API Mesh.
 *
 * In production, you would install the dropin packages:
 *   npm install @adobe/commerce-dropin-sdk
 *   npm install @adobe/commerce-dropin-product
 *
 * Dropin lifecycle:
 *   1. SDK initializes connection to Commerce via API Mesh
 *   2. Block loads the Product dropin and passes the SKU
 *   3. Dropin fetches product data and renders its UI
 *   4. You customize appearance via CSS custom properties and slot overrides
 *
 * Content model (what authors create):
 * ┌──────────────────────────────────┐
 * │ Product Details                  │
 * ├──────────────────────────────────┤
 * │ TB-154706                        │  ← SKU (row 1)
 * └──────────────────────────────────┘
 */

// ============================================================
// Commerce Dropin SDK Configuration
// ============================================================

/**
 * In production, this config is typically set in scripts.js during
 * the eager phase, so all dropin blocks share the same connection.
 *
 * Example production initialization (in scripts.js):
 *
 *   import { initialize } from '@adobe/commerce-dropin-sdk';
 *
 *   initialize({
 *     endpoint: 'https://graph.adobe.io/api/<mesh-id>/graphql',
 *     environmentId: '<commerce-environment-id>',
 *     websiteCode: 'base',
 *     storeCode: 'main_website_store',
 *     storeViewCode: 'default',
 *     locale: 'en-US',
 *     currency: 'USD',
 *   });
 */

// ============================================================
// Mock Dropin SDK (for local development without Commerce)
// ============================================================

/**
 * Simulates the Commerce Dropin SDK for local development.
 * Replace with real @adobe/commerce-dropin-sdk in production.
 */
const MockDropinSDK = {
  /**
   * Simulates fetching product data from Commerce.
   * The real SDK does this via API Mesh → Commerce GraphQL.
   */
  async getProduct(sku) {
    // Simulate network latency
    await new Promise((resolve) => { setTimeout(resolve, 400); });

    const products = {
      'TB-154706': {
        sku: 'TB-154706',
        name: 'Kira Chevron Small Flap Shoulder Bag',
        description: 'Defined by its diamond-quilted pattern — a signature of the Kira line — this small shoulder bag is crafted from supple leather with a convertible chain strap. It\'s finished with the Double T logo on a bold, sculptural turnlock.',
        price: { regular: 498, final: 498, currency: 'USD' },
        images: [
          { url: 'https://placehold.co/800x1000/f5f5f5/333?text=Kira+Front', label: 'Front view' },
          { url: 'https://placehold.co/800x1000/f5f5f5/333?text=Kira+Side', label: 'Side view' },
          { url: 'https://placehold.co/800x1000/f5f5f5/333?text=Kira+Back', label: 'Back view' },
          { url: 'https://placehold.co/800x1000/f5f5f5/333?text=Kira+Detail', label: 'Detail view' },
        ],
        colors: [
          { label: 'Black', value: '#000000', selected: true },
          { label: 'New Cream', value: '#F5F0E8', selected: false },
          { label: 'Brie', value: '#C9A96E', selected: false },
        ],
        details: [
          'Quilted leather',
          'Magnetic snap closure',
          'Convertible chain strap',
          'Interior zip pocket',
          'Dimensions: 8" W x 6" H x 3" D',
          'Strap drop: 12" (shoulder), 22" (crossbody)',
        ],
        breadcrumbs: [
          { label: 'Home', url: '/' },
          { label: 'Handbags', url: '/handbags' },
          { label: 'Shoulder Bags', url: '/handbags/shoulder-bags' },
        ],
        inStock: true,
      },
      'TB-162587': {
        sku: 'TB-162587',
        name: 'Robinson Crossbody',
        description: 'A modern take on our iconic Robinson collection, this crossbody bag is crafted from scratch-resistant Saffiano leather. The compact silhouette features multiple interior pockets for organization on the go.',
        price: { regular: 348, final: 278, currency: 'USD' },
        images: [
          { url: 'https://placehold.co/800x1000/f5f5f5/333?text=Robinson+Front', label: 'Front view' },
          { url: 'https://placehold.co/800x1000/f5f5f5/333?text=Robinson+Side', label: 'Side view' },
        ],
        colors: [
          { label: 'Cardamom', value: '#A0522D', selected: true },
          { label: 'Black', value: '#000000', selected: false },
        ],
        details: [
          'Saffiano leather',
          'Zip-top closure',
          'Adjustable crossbody strap',
          'Interior zip and slip pockets',
          'Dimensions: 10" W x 7" H x 3.5" D',
        ],
        breadcrumbs: [
          { label: 'Home', url: '/' },
          { label: 'Handbags', url: '/handbags' },
          { label: 'Crossbody Bags', url: '/handbags/crossbody-bags' },
        ],
        inStock: true,
      },
    };

    return products[sku] || products['TB-154706'];
  },
};

// ============================================================
// Dropin Slot Renderers (Customization Layer)
// ============================================================

/**
 * Dropins use a "slot" system for customization. Each dropin exposes
 * named slots where you can inject custom HTML or override default rendering.
 *
 * Common PDP slots:
 *   - Breadcrumbs    → navigation above the product
 *   - Gallery        → product image gallery
 *   - Title          → product name
 *   - Price          → pricing display
 *   - Options        → color/size selectors
 *   - Description    → product description
 *   - Actions        → add to cart / wishlist buttons
 *   - Details        → accordion with product details
 *
 * You can override any slot to match your brand's design.
 */

function renderBreadcrumbs(breadcrumbs) {
  const nav = document.createElement('nav');
  nav.className = 'product-details-breadcrumbs';
  nav.setAttribute('aria-label', 'Breadcrumb');

  const ol = document.createElement('ol');
  breadcrumbs.forEach((crumb, i) => {
    const li = document.createElement('li');
    if (i < breadcrumbs.length - 1) {
      li.innerHTML = `<a href="${crumb.url}">${crumb.label}</a>`;
    } else {
      li.innerHTML = `<span aria-current="page">${crumb.label}</span>`;
    }
    ol.append(li);
  });

  nav.append(ol);
  return nav;
}

function renderGallery(images) {
  const gallery = document.createElement('div');
  gallery.className = 'product-details-gallery';

  // Main image
  const mainImg = document.createElement('div');
  mainImg.className = 'product-details-gallery-main';
  mainImg.innerHTML = `<img src="${images[0].url}" alt="${images[0].label}" loading="eager" width="800" height="1000" />`;

  // Thumbnails
  const thumbs = document.createElement('div');
  thumbs.className = 'product-details-gallery-thumbs';
  thumbs.setAttribute('role', 'tablist');
  thumbs.setAttribute('aria-label', 'Product images');

  images.forEach((img, i) => {
    const thumb = document.createElement('button');
    thumb.className = `product-details-thumb${i === 0 ? ' product-details-thumb-active' : ''}`;
    thumb.setAttribute('role', 'tab');
    thumb.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    thumb.setAttribute('aria-label', img.label);
    thumb.innerHTML = `<img src="${img.url}" alt="${img.label}" loading="lazy" width="100" height="125" />`;

    thumb.addEventListener('click', () => {
      mainImg.querySelector('img').src = img.url;
      mainImg.querySelector('img').alt = img.label;
      thumbs.querySelectorAll('.product-details-thumb').forEach((t) => {
        t.classList.remove('product-details-thumb-active');
        t.setAttribute('aria-selected', 'false');
      });
      thumb.classList.add('product-details-thumb-active');
      thumb.setAttribute('aria-selected', 'true');
    });

    thumbs.append(thumb);
  });

  gallery.append(mainImg, thumbs);
  return gallery;
}

function renderPrice(price) {
  const div = document.createElement('div');
  div.className = 'product-details-price';

  const hasDiscount = price.final < price.regular;
  if (hasDiscount) {
    div.innerHTML = `
      <span class="product-details-price-original">$${price.regular}</span>
      <span class="product-details-price-sale">$${price.final}</span>
    `;
  } else {
    div.innerHTML = `<span class="product-details-price-current">$${price.regular}</span>`;
  }

  return div;
}

function renderColorSwatches(colors) {
  const div = document.createElement('div');
  div.className = 'product-details-colors';

  const label = document.createElement('p');
  const selected = colors.find((c) => c.selected);
  label.className = 'product-details-colors-label';
  label.innerHTML = `Color: <strong>${selected?.label || ''}</strong>`;

  const swatches = document.createElement('div');
  swatches.className = 'product-details-swatches';
  swatches.setAttribute('role', 'radiogroup');
  swatches.setAttribute('aria-label', 'Select color');

  colors.forEach((color) => {
    const btn = document.createElement('button');
    btn.className = `product-details-swatch${color.selected ? ' product-details-swatch-active' : ''}`;
    btn.setAttribute('role', 'radio');
    btn.setAttribute('aria-checked', color.selected ? 'true' : 'false');
    btn.setAttribute('aria-label', color.label);
    btn.style.backgroundColor = color.value;

    btn.addEventListener('click', () => {
      swatches.querySelectorAll('.product-details-swatch').forEach((s) => {
        s.classList.remove('product-details-swatch-active');
        s.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('product-details-swatch-active');
      btn.setAttribute('aria-checked', 'true');
      label.innerHTML = `Color: <strong>${color.label}</strong>`;
    });

    swatches.append(btn);
  });

  div.append(label, swatches);
  return div;
}

function renderActions(product) {
  const div = document.createElement('div');
  div.className = 'product-details-actions';

  const addToCart = document.createElement('button');
  addToCart.className = 'product-details-add-to-cart';
  addToCart.textContent = product.inStock ? 'Add to Bag' : 'Out of Stock';
  addToCart.disabled = !product.inStock;

  addToCart.addEventListener('click', () => {
    // In production, this calls the Cart dropin API:
    //   import { addToCart } from '@adobe/commerce-dropin-cart';
    //   addToCart({ sku: product.sku, quantity: 1 });
    addToCart.textContent = 'Added!';
    addToCart.classList.add('product-details-added');
    setTimeout(() => {
      addToCart.textContent = 'Add to Bag';
      addToCart.classList.remove('product-details-added');
    }, 2000);
  });

  const wishlist = document.createElement('button');
  wishlist.className = 'product-details-wishlist';
  wishlist.setAttribute('aria-label', 'Add to wishlist');
  wishlist.innerHTML = '&#9825;'; // heart outline

  wishlist.addEventListener('click', () => {
    wishlist.classList.toggle('product-details-wishlisted');
    wishlist.innerHTML = wishlist.classList.contains('product-details-wishlisted') ? '&#9829;' : '&#9825;';
  });

  div.append(addToCart, wishlist);
  return div;
}

function renderDetails(details) {
  const div = document.createElement('div');
  div.className = 'product-details-accordion';

  // Product details accordion
  const detailsSection = document.createElement('details');
  detailsSection.open = true;
  const summary = document.createElement('summary');
  summary.textContent = 'Product Details';
  const ul = document.createElement('ul');
  details.forEach((detail) => {
    const li = document.createElement('li');
    li.textContent = detail;
    ul.append(li);
  });
  detailsSection.append(summary, ul);

  // Shipping accordion
  const shipping = document.createElement('details');
  const shipSummary = document.createElement('summary');
  shipSummary.textContent = 'Shipping & Returns';
  shipping.innerHTML = '';
  shipping.append(shipSummary);
  const shipContent = document.createElement('p');
  shipContent.textContent = 'Complimentary ground shipping on all orders. Free returns within 30 days of purchase.';
  shipping.append(shipContent);

  div.append(detailsSection, shipping);
  return div;
}

// ============================================================
// Block Decorator
// ============================================================

/**
 * Loads and decorates the product-details block.
 *
 * This follows the Dropin integration pattern:
 * 1. Extract SKU from authored content
 * 2. Call the dropin SDK to fetch product data
 * 3. Render using customizable slot functions
 *
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  // Extract SKU from authored content
  const sku = block.querySelector('div')?.textContent?.trim() || 'TB-154706';

  // Clear authored content
  block.textContent = '';

  // Show loading skeleton (matches dropin loading pattern)
  block.classList.add('product-details-loading');
  const skeleton = document.createElement('div');
  skeleton.className = 'product-details-skeleton';
  skeleton.innerHTML = `
    <div class="product-details-skeleton-gallery"></div>
    <div class="product-details-skeleton-info">
      <div class="product-details-skeleton-line" style="width: 60%"></div>
      <div class="product-details-skeleton-line" style="width: 40%"></div>
      <div class="product-details-skeleton-line" style="width: 80%"></div>
    </div>
  `;
  block.append(skeleton);

  try {
    /**
     * In production with real dropins, this would be:
     *
     *   import { render as renderPDP } from '@adobe/commerce-dropin-product';
     *
     *   renderPDP(block, {
     *     sku,
     *     slots: {
     *       Title: (ctx) => html`<h1>${ctx.product.name}</h1>`,
     *       Price: (ctx) => renderPrice(ctx.product.price_range),
     *       Actions: (ctx) => renderActions(ctx),
     *     },
     *     onAddToCart: ({ sku, quantity }) => {
     *       // Trigger cart dropin update
     *       cartApi.addItem(sku, quantity);
     *     },
     *   });
     *
     * For this demo, we simulate the dropin behavior manually.
     */
    const product = await MockDropinSDK.getProduct(sku);

    // Remove skeleton
    skeleton.remove();
    block.classList.remove('product-details-loading');

    // Build PDP layout (two-column: gallery | info)
    const layout = document.createElement('div');
    layout.className = 'product-details-layout';

    // Left column — Gallery
    const leftCol = document.createElement('div');
    leftCol.className = 'product-details-col-gallery';
    leftCol.append(renderGallery(product.images));

    // Right column — Product info
    const rightCol = document.createElement('div');
    rightCol.className = 'product-details-col-info';

    // Breadcrumbs
    rightCol.append(renderBreadcrumbs(product.breadcrumbs));

    // Title
    const title = document.createElement('h1');
    title.className = 'product-details-title';
    title.textContent = product.name;
    rightCol.append(title);

    // Price
    rightCol.append(renderPrice(product.price));

    // Color swatches
    if (product.colors?.length) {
      rightCol.append(renderColorSwatches(product.colors));
    }

    // Description
    const desc = document.createElement('p');
    desc.className = 'product-details-description';
    desc.textContent = product.description;
    rightCol.append(desc);

    // Add to cart + wishlist
    rightCol.append(renderActions(product));

    // Product details accordion
    rightCol.append(renderDetails(product.details));

    layout.append(leftCol, rightCol);
    block.append(layout);
  } catch (error) {
    skeleton.remove();
    block.classList.remove('product-details-loading');
    block.innerHTML = '<p class="product-details-error">Unable to load product details. Please try again later.</p>';
    // eslint-disable-next-line no-console
    console.error('Product details dropin failed:', error);
  }
}
