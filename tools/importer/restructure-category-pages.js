import { readFileSync, writeFileSync } from 'fs';
import * as cheerio from 'cheerio';

const files = [
  'content/en-us/shoes/view-all.plain.html',
  'content/en-us/clothing/view-all.plain.html',
  'content/en-us/accessories/view-all.plain.html',
];

const MAX_PRODUCTS = 10;

function cleanPrice(text) {
  if (!text) return null;
  // Extract just the first price like "$200" from "$200original price $200"
  // Also strip "Best Seller", "Runway", etc.
  const match = text.match(/(\$[\d,]+)/);
  return match ? match[1] : null;
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function processFile(filePath) {
  const html = readFileSync(filePath, 'utf-8');
  const $ = cheerio.load(html, { xmlMode: false, decodeEntities: false });

  // Extract the H1 title
  const h1 = $('h1').first();
  const h1Text = h1.text();
  const h1Id = h1.attr('id') || slugify(h1Text);

  // Extract the metadata div (last div with class="metadata")
  const metadataDiv = $('div:has(.metadata)').last();
  const metadataHtml = metadataDiv.length ? metadataDiv.prop('outerHTML') : '';

  // Extract products from all <ul> <li> elements
  const products = [];
  $('ul li').each((_, li) => {
    const $li = $(li);

    // Skip promotional items (those with h2) and empty items
    if ($li.find('h2').length > 0) return;
    if ($li.children().length === 0) return;

    // Find the product name link (an <a> with text, not just an image)
    const nameLink = $li.find('a').filter((_, a) => {
      const $a = $(a);
      return $a.text().trim() && !$a.find('img').length;
    }).first();

    if (!nameLink.length) return;

    const productName = nameLink.text().trim();
    const productHref = nameLink.attr('href');

    // Find product image
    const img = $li.find('img').first();
    const imgSrc = img.length ? img.attr('src') : '';
    const imgAlt = img.length ? (img.attr('alt') || '') : '';

    // Find price - look for <p> text that contains a dollar sign
    let price = null;
    $li.find('p').each((_, p) => {
      const text = $(p).text().trim();
      if (text.startsWith('$') && !price) {
        price = cleanPrice(text);
      }
    });

    if (productName && productHref && price && imgSrc) {
      products.push({ productName, productHref, imgSrc, imgAlt, price });
    }
  });

  // Take only the first 10 products
  const selectedProducts = products.slice(0, MAX_PRODUCTS);

  // Build the cards-product block content
  const productDivs = selectedProducts
    .map(
      (p) =>
        `<div><div>${p.imgSrc ? `<img src="${p.imgSrc}" alt="${p.imgAlt}">` : ''}</div><div><p><a href="${p.productHref}">${p.productName}</a></p><p>${p.price}</p></div></div>`,
    )
    .join('');

  const h2Id = slugify('Products');

  // Build the final HTML
  const output = [
    `<div><h1 id="${h1Id}">${h1Text}</h1></div>`,
    `<div><h2 id="${h2Id}">Products</h2><div class="cards-product">${productDivs}</div></div>`,
    metadataHtml,
  ].join('\n');

  writeFileSync(filePath, output, 'utf-8');
  console.log(`Processed ${filePath}: ${selectedProducts.length} products extracted from ${products.length} total`);
}

// Process all files
const rootDir = new URL('../../', import.meta.url).pathname;
for (const file of files) {
  const fullPath = rootDir + file;
  processFile(fullPath);
}

console.log('Done!');
