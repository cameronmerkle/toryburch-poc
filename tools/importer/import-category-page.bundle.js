var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-category-page.js
  var import_category_page_exports = {};
  __export(import_category_page_exports, {
    default: () => import_category_page_default
  });

  // tools/importer/parsers/cards-product.js
  function parse(element, { document }) {
    const MAX_PRODUCTS = 2;
    const productTiles = Array.from(element.querySelectorAll(".tile-0sd"));
    const tiles = productTiles.length > 0 ? productTiles : [element];
    const cells = [];
    const limit = Math.min(tiles.length, MAX_PRODUCTS);
    for (let i = 0; i < limit; i += 1) {
      const tile = tiles[i];
      const img = tile.querySelector(".slide__image-tNl img.asset__image-mAA");
      const imageCell = document.createElement("div");
      if (img) {
        const newImg = document.createElement("img");
        newImg.src = img.src;
        newImg.alt = img.alt || "";
        imageCell.appendChild(newImg);
      }
      const nameLink = tile.querySelector("a.tile__name-Wky");
      const priceEl = tile.querySelector(".price-item-TRt");
      const textCell = document.createElement("div");
      if (nameLink) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = nameLink.href;
        a.textContent = nameLink.textContent.trim();
        p.appendChild(a);
        textCell.appendChild(p);
      }
      if (priceEl) {
        const pPrice = document.createElement("p");
        pPrice.textContent = priceEl.textContent.trim();
        textCell.appendChild(pPrice);
      }
      cells.push([imageCell, textCell]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/toryburch-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        '[class*="cookie"]',
        '[class*="consent"]',
        ".above-nav-VnY",
        ".above-nav__carousel-wrapper--hidden-cI6",
        "noscript",
        "iframe"
      ]);
      if (element.style && element.style.overflow === "hidden") {
        element.style.overflow = "auto";
      }
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        "header#layout-header",
        "footer#layout-footer",
        "nav.bot-navigation-Vm0",
        ".skip-link-bX1",
        "link",
        "source",
        'img[src*="analytics.yahoo.com"]',
        'img[src*="doubleclick.net"]',
        'img[src*="google.com/pagead"]',
        'img[src*="snapchat.com"]',
        'img[src*="bazaarvoice.com"]',
        'img[src*="tvsquared.com"]',
        'img[src*="linksynergy.com"]',
        'img[src*="adservice.google.com"]',
        '[class*="favorite-button"]',
        '[class*="heart-button"]'
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-track");
        el.removeAttribute("onclick");
        el.removeAttribute("data-testid");
      });
    }
  }

  // tools/importer/transformers/toryburch-sections.js
  var H2 = { before: "beforeTransform", after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const { template } = payload || {};
      const sections = template && template.sections;
      if (!sections || sections.length < 2) return;
      const document = element.ownerDocument;
      const reversedSections = [...sections].reverse();
      reversedSections.forEach((section) => {
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) return;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadata);
        }
        if (section.id !== sections[0].id) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      });
    }
  }

  // tools/importer/transformers/category-cleanup.js
  var H3 = { before: "beforeTransform", after: "afterTransform" };
  function transform3(hookName, element, payload) {
    if (hookName === H3.before) {
      WebImporter.DOMUtils.remove(element, [
        ".filters-cZY",
        ".sticky-set__filter-panel-MpC",
        ".tile__quickshop-WFL",
        ".carousel__heart-xAW",
        ".carousel__arrow-vrw",
        ".tile__swatches-auv",
        ".slider__slide-_Md:not(.slider__slide--active-dA9)",
        ".view-more-btn-oQq",
        ".view-more-btn__show-all-g92",
        'button[title="Add to favorites"]',
        'button[title="Previous image"]',
        'button[title="Next image"]',
        "video"
      ]);
      WebImporter.DOMUtils.remove(element, [
        '[class*="bottom-search"]',
        '[class*="accordion"]',
        '[class*="sign-up"]',
        '[class*="sign-up-portal"]',
        '[class*="modal"]',
        '[class*="overlay"]',
        '[class*="general-error"]'
      ]);
      const viewMoreSections = element.querySelectorAll(".view-more-d8i");
      viewMoreSections.forEach((section, idx) => {
        if (idx >= 5) section.remove();
      });
    }
  }

  // tools/importer/import-category-page.js
  var parsers = {
    "cards-product": parse
  };
  var PAGE_TEMPLATE = {
    name: "category-page",
    urls: [
      "https://www.toryburch.com/en-us/handbags/",
      "https://www.toryburch.com/en-us/shoes/view-all/",
      "https://www.toryburch.com/en-us/clothing/view-all/",
      "https://www.toryburch.com/en-us/accessories/view-all/"
    ],
    description: "Category listing page with page title, product category sections with product grids, and footer",
    blocks: [
      {
        name: "cards-product",
        instances: [
          ".view-more-d8i:nth-of-type(1) .product-grid-X6o",
          ".view-more-d8i:nth-of-type(2) .product-grid-X6o",
          ".view-more-d8i:nth-of-type(3) .product-grid-X6o",
          ".view-more-d8i:nth-of-type(4) .product-grid-X6o",
          ".view-more-d8i:nth-of-type(5) .product-grid-X6o"
        ]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Page Title",
        selector: "h1.title__text-z_k",
        style: null,
        blocks: [],
        defaultContent: ["h1.title__text-z_k"]
      },
      {
        id: "section-2",
        name: "Totes",
        selector: ".view-more-d8i:nth-of-type(1)",
        style: null,
        blocks: ["cards-product"],
        defaultContent: [".view-more__title-iXJ"]
      },
      {
        id: "section-3",
        name: "Crossbody Bags",
        selector: ".view-more-d8i:nth-of-type(2)",
        style: null,
        blocks: ["cards-product"],
        defaultContent: [".view-more__title-iXJ"]
      },
      {
        id: "section-4",
        name: "Shoulder Bags",
        selector: ".view-more-d8i:nth-of-type(3)",
        style: null,
        blocks: ["cards-product"],
        defaultContent: [".view-more__title-iXJ"]
      },
      {
        id: "section-5",
        name: "Bucket Bags",
        selector: ".view-more-d8i:nth-of-type(4)",
        style: null,
        blocks: ["cards-product"],
        defaultContent: [".view-more__title-iXJ"]
      },
      {
        id: "section-6",
        name: "Mini Bags & Chain Wallets",
        selector: ".view-more-d8i:nth-of-type(5)",
        style: null,
        blocks: ["cards-product"],
        defaultContent: [".view-more__title-iXJ"]
      }
    ]
  };
  var transformers = [
    transform3,
    transform,
    transform2
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            element
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_category_page_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_category_page_exports);
})();
