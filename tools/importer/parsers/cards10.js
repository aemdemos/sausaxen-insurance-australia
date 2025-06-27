/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per block name
  const headerRow = ['Cards (cards10)'];

  // Select all direct card containers
  const cardWrappers = Array.from(
    element.querySelectorAll(':scope > div.grid-container > div.grid-container__item')
  );

  const rows = cardWrappers.map(card => {
    // 1st cell: Image/Icon
    let image = card.querySelector('.cmp-image__image');
    // Defensive: If image is wrapped, use the parent .cmp-image if present
    if (!image) {
      const imageWrap = card.querySelector('.cmp-image');
      if (imageWrap) image = imageWrap;
    }

    // 2nd cell: Text content (title, desc, CTA)
    const contentParts = [];

    // Title (with level preserved)
    const title = card.querySelector('.cmp-title');
    if (title) contentParts.push(title);

    // Description text
    const desc = card.querySelector('.cmp-text');
    if (desc) contentParts.push(desc);

    // CTAs: Collect all <a> and <button> inside button group, inline as in source
    const ctaContainer = card.querySelector(
      '.cmp-button-group--top-padding--disabled, .cmp-button-group--bottom-padding--disabled, .cmp-button-group, .cmp-container'
    );
    if (ctaContainer) {
      const ctalinkEls = Array.from(ctaContainer.querySelectorAll('a,button'));
      if (ctalinkEls.length > 0) {
        // Insert with a space between if more than one
        const ctaDiv = document.createElement('div');
        ctalinkEls.forEach((ctaEl, idx) => {
          ctaDiv.appendChild(ctaEl);
          if (idx < ctalinkEls.length - 1) ctaDiv.appendChild(document.createTextNode(' '));
        });
        contentParts.push(ctaDiv);
      }
    }

    // Defensive: if no content, insert a placeholder
    const contentCell = contentParts.length > 0 ? contentParts : '';

    // Compose row: always two columns
    return [image || '', contentCell];
  });

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the original element with the table
  element.replaceWith(table);
}
