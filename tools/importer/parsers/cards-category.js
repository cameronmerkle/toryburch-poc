/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-category.
 * Base: cards. Source: https://www.toryburch.com
 * Target: 2 cols per row — col1: category image, col2: category name link
 * Selectors from captured DOM: .r-grid__col--l--3-TLX, img.asset__image-mAA,
 *   a.text-link-Tf5, h2.h2-style-templates
 */
export default function parse(element, { document }) {
  // Find all category tile columns (4 tiles in the grid)
  const categoryTiles = Array.from(element.querySelectorAll('.r-grid__col--l--3-TLX'));
  const cells = [];

  // If we matched a single tile, process just this element
  const tiles = categoryTiles.length > 0 ? categoryTiles : [element];

  tiles.forEach((tile) => {
    const img = tile.querySelector('img.asset__image-mAA');
    const link = tile.querySelector('a.text-link-Tf5');
    const heading = tile.querySelector('h2.h2-style-templates');

    const imageCell = document.createElement('div');
    if (img) {
      const newImg = document.createElement('img');
      newImg.src = img.src;
      newImg.alt = img.alt || '';
      imageCell.appendChild(newImg);
    }

    const textCell = document.createElement('div');
    const label = heading || link;
    if (label) {
      const p = document.createElement('p');
      if (link) {
        const a = document.createElement('a');
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

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-category', cells });
  element.replaceWith(block);
}
