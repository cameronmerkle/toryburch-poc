/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import cardsProductParser from './parsers/cards-product.js';

// TRANSFORMER IMPORTS
import toryburchCleanupTransformer from './transformers/toryburch-cleanup.js';
import toryburchSectionsTransformer from './transformers/toryburch-sections.js';
import categoryCleanupTransformer from './transformers/category-cleanup.js';

// PARSER REGISTRY
const parsers = {
  'cards-product': cardsProductParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'category-page',
  urls: [
    'https://www.toryburch.com/en-us/handbags/',
    'https://www.toryburch.com/en-us/shoes/view-all/',
    'https://www.toryburch.com/en-us/clothing/view-all/',
    'https://www.toryburch.com/en-us/accessories/view-all/',
  ],
  description: 'Category listing page with page title, product category sections with product grids, and footer',
  blocks: [
    {
      name: 'cards-product',
      instances: [
        '.view-more-d8i:nth-of-type(1) .product-grid-X6o',
        '.view-more-d8i:nth-of-type(2) .product-grid-X6o',
        '.view-more-d8i:nth-of-type(3) .product-grid-X6o',
        '.view-more-d8i:nth-of-type(4) .product-grid-X6o',
        '.view-more-d8i:nth-of-type(5) .product-grid-X6o',
      ],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Page Title',
      selector: 'h1.title__text-z_k',
      style: null,
      blocks: [],
      defaultContent: ['h1.title__text-z_k'],
    },
    {
      id: 'section-2',
      name: 'Totes',
      selector: '.view-more-d8i:nth-of-type(1)',
      style: null,
      blocks: ['cards-product'],
      defaultContent: ['.view-more__title-iXJ'],
    },
    {
      id: 'section-3',
      name: 'Crossbody Bags',
      selector: '.view-more-d8i:nth-of-type(2)',
      style: null,
      blocks: ['cards-product'],
      defaultContent: ['.view-more__title-iXJ'],
    },
    {
      id: 'section-4',
      name: 'Shoulder Bags',
      selector: '.view-more-d8i:nth-of-type(3)',
      style: null,
      blocks: ['cards-product'],
      defaultContent: ['.view-more__title-iXJ'],
    },
    {
      id: 'section-5',
      name: 'Bucket Bags',
      selector: '.view-more-d8i:nth-of-type(4)',
      style: null,
      blocks: ['cards-product'],
      defaultContent: ['.view-more__title-iXJ'],
    },
    {
      id: 'section-6',
      name: 'Mini Bags & Chain Wallets',
      selector: '.view-more-d8i:nth-of-type(5)',
      style: null,
      blocks: ['cards-product'],
      defaultContent: ['.view-more__title-iXJ'],
    },
  ],
};

// TRANSFORMER REGISTRY
// Category cleanup runs before general cleanup, sections transformer runs last in afterTransform
const transformers = [
  categoryCleanupTransformer,
  toryburchCleanupTransformer,
  toryburchSectionsTransformer,
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (category cleanup + general cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
