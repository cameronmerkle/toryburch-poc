/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroEditorialParser from './parsers/hero-editorial.js';
import carouselProductParser from './parsers/carousel-product.js';
import columnsEditorialParser from './parsers/columns-editorial.js';
import cardsCategoryParser from './parsers/cards-category.js';

// TRANSFORMER IMPORTS
import toryburchCleanupTransformer from './transformers/toryburch-cleanup.js';
import toryburchSectionsTransformer from './transformers/toryburch-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-editorial': heroEditorialParser,
  'carousel-product': carouselProductParser,
  'columns-editorial': columnsEditorialParser,
  'cards-category': cardsCategoryParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Tory Burch homepage with hero banners, featured collections, and promotional content',
  urls: ['https://www.toryburch.com'],
  blocks: [
    {
      name: 'hero-editorial',
      instances: ['#main-content .xp-fragment-kFe'],
    },
    {
      name: 'carousel-product',
      instances: ['.rec-carousel-xiN'],
    },
    {
      name: 'columns-editorial',
      instances: ['#main-content > div > .r-grid-SmN > .r-grid__col--m--6-vJX:has(.banner-AtC)'],
    },
    {
      name: 'cards-category',
      instances: ['#main-content .r-grid__col--l--3-TLX'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Banner',
      selector: '#main-content > div > .r-grid-SmN > .r-grid__col-N9o:nth-child(2)',
      style: null,
      blocks: ['hero-editorial'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Product Carousel',
      selector: '.rec-carousel-xiN',
      style: null,
      blocks: ['carousel-product'],
      defaultContent: [],
    },
    {
      id: 'section-3',
      name: 'Two-Column Editorial',
      selector: '#main-content > div > .r-grid-SmN > .r-grid__col--m--6-vJX',
      style: null,
      blocks: ['columns-editorial'],
      defaultContent: [],
    },
    {
      id: 'section-4',
      name: 'Category Grid',
      selector: '#main-content .r-grid__col--l--3-TLX',
      style: null,
      blocks: ['cards-category'],
      defaultContent: [],
    },
    {
      id: 'section-5',
      name: 'Runway Editorial Banner',
      selector: '#main-content > div > .r-grid-SmN > .r-grid__col-N9o:has(h2)',
      style: null,
      blocks: ['hero-editorial'],
      defaultContent: [],
    },
    {
      id: 'section-6',
      name: 'Tory Sport Banner',
      selector: '#main-content > div > .r-grid-SmN > .r-grid__col-N9o:last-of-type:has(h2)',
      style: null,
      blocks: ['hero-editorial'],
      defaultContent: [],
    },
    {
      id: 'section-7',
      name: 'Newsletter and Foundation',
      selector: '#layout-footer',
      style: 'dark',
      blocks: [],
      defaultContent: ['#layout-footer .footer-OEo'],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  toryburchCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [toryburchSectionsTransformer] : []),
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
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
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
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
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
