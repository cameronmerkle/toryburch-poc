/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-product.
 * Base: carousel. Source: https://www.toryburch.com
 * Target: 2 cols per row — col1: product image, col2: product name + link
 * Selectors from captured DOM: .tile-0sd, .tile__preview-image-_3R img, .tile__name-Wky
 */
export default function parse(element, { document }) {
  // Find all product tiles in the carousel
  const tiles = Array.from(element.querySelectorAll('.tile-0sd'));
  const cells = [];

  tiles.forEach((tile) => {
    const img = tile.querySelector('.tile__preview-image-_3R img.asset__image-mAA, .tile__preview-image-_3R img');
    const nameLink = tile.querySelector('a.tile__name-Wky');

    if (img || nameLink) {
      const imageCell = document.createElement('div');
      if (img) {
        const newImg = document.createElement('img');
        newImg.src = img.src;
        newImg.alt = img.alt || '';
        imageCell.appendChild(newImg);
      }

      const textCell = document.createElement('div');
      if (nameLink) {
        const a = document.createElement('a');
        a.href = nameLink.href;
        a.textContent = nameLink.textContent.trim();
        const p = document.createElement('p');
        p.appendChild(a);
        textCell.appendChild(p);
      }

      cells.push([imageCell, textCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-product', cells });
  element.replaceWith(block);
}
