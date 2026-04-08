/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Tory Burch site cleanup.
 * Selectors from captured DOM of https://www.toryburch.com
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove cookie/consent banners, tracking pixels, chat widgets
    // Found in captured DOM: above-nav carousel banners, duplicate mobile/desktop variants
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '[class*="cookie"]',
      '[class*="consent"]',
      '.above-nav-VnY',
      '.above-nav__carousel-wrapper--hidden-cI6',
      'noscript',
      'iframe',
    ]);

    // Fix overflow hidden on body (from captured DOM: style="overflow: hidden;")
    if (element.style && element.style.overflow === 'hidden') {
      element.style.overflow = 'auto';
    }
  }

  if (hookName === H.after) {
    // Remove non-authorable content: header, footer, nav, tracking images
    WebImporter.DOMUtils.remove(element, [
      'header#layout-header',
      'footer#layout-footer',
      'nav.bot-navigation-Vm0',
      '.skip-link-bX1',
      'link',
      'source',
      'img[src*="analytics.yahoo.com"]',
      'img[src*="doubleclick.net"]',
      'img[src*="google.com/pagead"]',
      'img[src*="snapchat.com"]',
      'img[src*="bazaarvoice.com"]',
      'img[src*="tvsquared.com"]',
      'img[src*="linksynergy.com"]',
      'img[src*="adservice.google.com"]',
      '[class*="favorite-button"]',
      '[class*="heart-button"]',
    ]);

    // Clean up data attributes from tracking
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-track');
      el.removeAttribute('onclick');
      el.removeAttribute('data-testid');
    });
  }
}
