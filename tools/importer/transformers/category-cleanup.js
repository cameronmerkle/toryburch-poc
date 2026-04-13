/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Category page cleanup.
 * Removes interactive elements not relevant to static content migration.
 * Only applies to category-page template.
 * Source: https://www.toryburch.com/en-us/handbags/
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove filter panels, quick-shop buttons, carousel controls, color swatches
    WebImporter.DOMUtils.remove(element, [
      '.filters-cZY',
      '.sticky-set__filter-panel-MpC',
      '.tile__quickshop-WFL',
      '.carousel__heart-xAW',
      '.carousel__arrow-vrw',
      '.tile__swatches-auv',
      '.slider__slide-_Md:not(.slider__slide--active-dA9)',
      '.view-more-btn-oQq',
      '.view-more-btn__show-all-g92',
      'button[title="Add to favorites"]',
      'button[title="Previous image"]',
      'button[title="Next image"]',
      'video',
    ]);

    // Remove bottom content: search, FAQ accordion, newsletter signup, promo popups, error messages
    WebImporter.DOMUtils.remove(element, [
      '[class*="bottom-search"]',
      '[class*="accordion"]',
      '[class*="sign-up"]',
      '[class*="sign-up-portal"]',
      '[class*="modal"]',
      '[class*="overlay"]',
      '[class*="general-error"]',
    ]);

    // Limit to first 5 category sections (10 products total at 2 per section)
    const viewMoreSections = element.querySelectorAll('.view-more-d8i');
    viewMoreSections.forEach((section, idx) => {
      if (idx >= 5) section.remove();
    });
  }
}
