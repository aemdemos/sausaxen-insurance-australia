/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the hero image (brand icon at the top)
  function findHeroImage(el) {
    // Find first visible .cmp-image__image inside the block
    const img = el.querySelector('.cmp-image__image, img');
    return img ? img.closest('.cmp-image') : null;
  }

  // Helper to find the title block (main heading)
  function findTitleBlock(el) {
    // Title is in a .cmp-title h1
    const title = el.querySelector('.cmp-title h1, h1.cmp-title__text, h1');
    return title ? title.closest('.cmp-title') : null;
  }

  // Helper to find the text/description block (under the title)
  function findDescriptionBlock(el) {
    // It's in a .cmp-text block near the title
    const text = el.querySelector('.cmp-text');
    return text ? text : null;
  }

  // Helper to find the CTA block (Get a quote bubble)
  function findCTA(el) {
    // It's the .flexlayoutcontainer.flex--bg-neutral containing .cmp-quoteandbuy
    const bubble = el.querySelector('.flexlayoutcontainer.flex--bg-neutral');
    return bubble || null;
  }

  // Header row
  const headerRow = ['Hero (hero3)'];

  // Row 2: The image (brand icon)
  const imageEl = findHeroImage(element);
  const imageRow = [imageEl ? imageEl : ''];

  // Row 3: Title, Description, CTA as a single cell (in that order)
  const content = [];
  const titleEl = findTitleBlock(element);
  if (titleEl) content.push(titleEl);
  const descEl = findDescriptionBlock(element);
  if (descEl) content.push(descEl);
  const ctaEl = findCTA(element);
  if (ctaEl) content.push(ctaEl);

  const contentRow = [content];

  // Build table
  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}