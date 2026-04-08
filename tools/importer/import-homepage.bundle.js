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

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-editorial.js
  function parse(element, { document }) {
    const bgImage = element.querySelector(".video__overlay-fju img, figure.asset-SaL img, .asset__image-mAA");
    const richText = element.querySelector(".rich-text-wgY");
    const headings = richText ? Array.from(richText.querySelectorAll('h1, h2, h3, h4, h5, h6, p > span[class*="rte-font--sweet-sans-pro-medium"]')) : [];
    const ctaLinks = richText ? Array.from(richText.querySelectorAll("a.text-link-Tf5, a.link-sZR:not(.banner__link-I5x)")) : [];
    const cells = [];
    if (bgImage) {
      const img = document.createElement("img");
      img.src = bgImage.src;
      img.alt = bgImage.alt || "";
      cells.push([img]);
    }
    const contentCell = [];
    headings.forEach((heading) => {
      const text = heading.textContent.trim();
      if (text && !text.includes("SHOP")) {
        const h2 = document.createElement("h2");
        h2.textContent = text;
        contentCell.push(h2);
      }
    });
    ctaLinks.forEach((link) => {
      const a = document.createElement("a");
      a.href = link.href;
      a.textContent = link.textContent.trim();
      contentCell.push(a);
    });
    if (contentCell.length > 0) {
      cells.push(contentCell);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-editorial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-product.js
  function parse2(element, { document }) {
    const tiles = Array.from(element.querySelectorAll(".tile-0sd"));
    const cells = [];
    tiles.forEach((tile) => {
      const img = tile.querySelector(".tile__preview-image-_3R img.asset__image-mAA, .tile__preview-image-_3R img");
      const nameLink = tile.querySelector("a.tile__name-Wky");
      if (img || nameLink) {
        const imageCell = document.createElement("div");
        if (img) {
          const newImg = document.createElement("img");
          newImg.src = img.src;
          newImg.alt = img.alt || "";
          imageCell.appendChild(newImg);
        }
        const textCell = document.createElement("div");
        if (nameLink) {
          const a = document.createElement("a");
          a.href = nameLink.href;
          a.textContent = nameLink.textContent.trim();
          const p = document.createElement("p");
          p.appendChild(a);
          textCell.appendChild(p);
        }
        cells.push([imageCell, textCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-editorial.js
  function parse3(element, { document }) {
    const panels = Array.from(element.querySelectorAll(":scope .r-grid__col--m--6-vJX:has(.banner-AtC)"));
    const row = [];
    panels.forEach((panel) => {
      const img = panel.querySelector("img.asset__image-mAA");
      const heading = panel.querySelector("h2.h2-style-templates, h2, h1");
      const ctaLink = panel.querySelector("a.text-link-Tf5, a[href]");
      const colContent = document.createElement("div");
      if (img) {
        const newImg = document.createElement("img");
        newImg.src = img.src;
        newImg.alt = img.alt || "";
        colContent.appendChild(newImg);
      }
      if (heading) {
        const h2 = document.createElement("h2");
        h2.textContent = heading.textContent.trim();
        colContent.appendChild(h2);
      }
      if (ctaLink) {
        const a = document.createElement("a");
        a.href = ctaLink.href;
        a.textContent = ctaLink.textContent.trim();
        const p = document.createElement("p");
        p.appendChild(a);
        colContent.appendChild(p);
      }
      row.push(colContent);
    });
    const cells = [];
    if (row.length > 0) {
      cells.push(row);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-editorial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-category.js
  function parse4(element, { document }) {
    const categoryTiles = Array.from(element.querySelectorAll(".r-grid__col--l--3-TLX"));
    const cells = [];
    const tiles = categoryTiles.length > 0 ? categoryTiles : [element];
    tiles.forEach((tile) => {
      const img = tile.querySelector("img.asset__image-mAA");
      const link = tile.querySelector("a.text-link-Tf5");
      const heading = tile.querySelector("h2.h2-style-templates");
      const imageCell = document.createElement("div");
      if (img) {
        const newImg = document.createElement("img");
        newImg.src = img.src;
        newImg.alt = img.alt || "";
        imageCell.appendChild(newImg);
      }
      const textCell = document.createElement("div");
      const label = heading || link;
      if (label) {
        const p = document.createElement("p");
        if (link) {
          const a = document.createElement("a");
          a.href = link.href;
          a.textContent = link.textContent.trim();
          p.appendChild(a);
        } else {
          p.textContent = label.textContent.trim();
        }
        textCell.appendChild(p);
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-category", cells });
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

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-editorial": parse,
    "carousel-product": parse2,
    "columns-editorial": parse3,
    "cards-category": parse4
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Tory Burch homepage with hero banners, featured collections, and promotional content",
    urls: ["https://www.toryburch.com"],
    blocks: [
      {
        name: "hero-editorial",
        instances: ["#main-content .xp-fragment-kFe"]
      },
      {
        name: "carousel-product",
        instances: [".rec-carousel-xiN"]
      },
      {
        name: "columns-editorial",
        instances: ["#main-content > div > .r-grid-SmN > .r-grid__col--m--6-vJX:has(.banner-AtC)"]
      },
      {
        name: "cards-category",
        instances: ["#main-content .r-grid__col--l--3-TLX"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Banner",
        selector: "#main-content > div > .r-grid-SmN > .r-grid__col-N9o:nth-child(2)",
        style: null,
        blocks: ["hero-editorial"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Product Carousel",
        selector: ".rec-carousel-xiN",
        style: null,
        blocks: ["carousel-product"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Two-Column Editorial",
        selector: "#main-content > div > .r-grid-SmN > .r-grid__col--m--6-vJX",
        style: null,
        blocks: ["columns-editorial"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "Category Grid",
        selector: "#main-content .r-grid__col--l--3-TLX",
        style: null,
        blocks: ["cards-category"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "Runway Editorial Banner",
        selector: "#main-content > div > .r-grid-SmN > .r-grid__col-N9o:has(h2)",
        style: null,
        blocks: ["hero-editorial"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Tory Sport Banner",
        selector: "#main-content > div > .r-grid-SmN > .r-grid__col-N9o:last-of-type:has(h2)",
        style: null,
        blocks: ["hero-editorial"],
        defaultContent: []
      },
      {
        id: "section-7",
        name: "Newsletter and Foundation",
        selector: "#layout-footer",
        style: "dark",
        blocks: [],
        defaultContent: ["#layout-footer .footer-OEo"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
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
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
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
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
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
  return __toCommonJS(import_homepage_exports);
})();
