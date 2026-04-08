/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-editorial.
 * Base: hero. Source: https://www.toryburch.com
 * Target: 1 col, 2 rows — row1: background image, row2: heading + text + CTAs
 * Selectors from captured DOM: .banner-AtC, .video-wYN, .banner__properties-BJd, .rich-text-wgY
 */
export default function parse(element, { document }) {
  // Extract background image (from video overlay or figure)
  const bgImage = element.querySelector('.video__overlay-fju img, figure.asset-SaL img, .asset__image-mAA');

  // Extract text content from banner properties
  const richText = element.querySelector('.rich-text-wgY');
  const headings = richText ? Array.from(richText.querySelectorAll('h1, h2, h3, h4, h5, h6, p > span[class*="rte-font--sweet-sans-pro-medium"]')) : [];
  const ctaLinks = richText ? Array.from(richText.querySelectorAll('a.text-link-Tf5, a.link-sZR:not(.banner__link-I5x)')) : [];

  const cells = [];

  // Row 1: Background image (optional per hero spec)
  if (bgImage) {
    const img = document.createElement('img');
    img.src = bgImage.src;
    img.alt = bgImage.alt || '';
    cells.push([img]);
  }

  // Row 2: Content — heading, subheading, CTAs
  const contentCell = [];

  headings.forEach((heading) => {
    const text = heading.textContent.trim();
    if (text && !text.includes('SHOP')) {
      const h2 = document.createElement('h2');
      h2.textContent = text;
      contentCell.push(h2);
    }
  });

  ctaLinks.forEach((link) => {
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.textContent.trim();
    contentCell.push(a);
  });

  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-editorial', cells });
  element.replaceWith(block);
}
