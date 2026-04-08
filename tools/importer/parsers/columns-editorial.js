/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-editorial.
 * Base: columns. Source: https://www.toryburch.com
 * Target: 2 columns per row — each col has image + heading + CTA link
 * Selectors from captured DOM: .r-grid__col--m--6-vJX, .banner-AtC, .asset__image-mAA,
 *   h2.h2-style-templates, a.text-link-Tf5
 */
export default function parse(element, { document }) {
  // Find the two side-by-side column panels
  // Each panel is a .r-grid__col--m--6-vJX containing a banner with image/text
  const panels = Array.from(element.querySelectorAll(':scope .r-grid__col--m--6-vJX:has(.banner-AtC)'));

  // Build one row with N columns
  const row = [];

  panels.forEach((panel) => {
    const img = panel.querySelector('img.asset__image-mAA');
    const heading = panel.querySelector('h2.h2-style-templates, h2, h1');
    const ctaLink = panel.querySelector('a.text-link-Tf5, a[href]');

    const colContent = document.createElement('div');

    if (img) {
      const newImg = document.createElement('img');
      newImg.src = img.src;
      newImg.alt = img.alt || '';
      colContent.appendChild(newImg);
    }

    if (heading) {
      const h2 = document.createElement('h2');
      h2.textContent = heading.textContent.trim();
      colContent.appendChild(h2);
    }

    if (ctaLink) {
      const a = document.createElement('a');
      a.href = ctaLink.href;
      a.textContent = ctaLink.textContent.trim();
      const p = document.createElement('p');
      p.appendChild(a);
      colContent.appendChild(p);
    }

    row.push(colContent);
  });

  const cells = [];
  if (row.length > 0) {
    cells.push(row);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-editorial', cells });
  element.replaceWith(block);
}
