/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-product.
 * Base: cards. Source: https://www.toryburch.com/en-us/handbags/
 * Target: 2 cols per row — col1: product image, col2: product name (linked) + price
 * Selectors: .product-grid-X6o, .tile-0sd, img.asset__image-mAA,
 *   a.tile__name-Wky, .price-item-TRt
 * Constraint: max 2 products per section instance
 */
export default function parse(element, { document }) {
  const MAX_PRODUCTS = 2;

  // Find all product tiles within the grid
  const productTiles = Array.from(element.querySelectorAll('.tile-0sd'));
  const tiles = productTiles.length > 0 ? productTiles : [element];

  const cells = [];
  const limit = Math.min(tiles.length, MAX_PRODUCTS);

  for (let i = 0; i < limit; i += 1) {
    const tile = tiles[i];

    // Get primary product image (first visible image in carousel)
    const img = tile.querySelector('.slide__image-tNl img.asset__image-mAA');
    const imageCell = document.createElement('div');
    if (img) {
      const newImg = document.createElement('img');
      newImg.src = img.src;
      newImg.alt = img.alt || '';
      imageCell.appendChild(newImg);
    }

    // Get product name and link
    const nameLink = tile.querySelector('a.tile__name-Wky');
    // Get price
    const priceEl = tile.querySelector('.price-item-TRt');

    const textCell = document.createElement('div');

    if (nameLink) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = nameLink.href;
      a.textContent = nameLink.textContent.trim();
      p.appendChild(a);
      textCell.appendChild(p);
    }

    if (priceEl) {
      const pPrice = document.createElement('p');
      pPrice.textContent = priceEl.textContent.trim();
      textCell.appendChild(pPrice);
    }

    cells.push([imageCell, textCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-product', cells });
  element.replaceWith(block);
}
