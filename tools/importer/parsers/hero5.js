/* global WebImporter */
export default function parse(element, { document }) {
  // Table header should match the block name exactly
  const headerRow = ['Hero (hero5)'];

  // Check for background image in the block, if any - there is none in this HTML
  const bgRow = [''];

  // Extract main content: title and body text, preserving semantic tags
  let contentEls = [];
  // The content is deeply nested, drill down to gridlayoutcontainer > grid-container
  const flexLayout = element.querySelector('.flexlayoutcontainer');
  if (flexLayout) {
    const gridLayout = flexLayout.querySelector('.gridlayoutcontainer');
    if (gridLayout) {
      const grid = gridLayout.querySelector('.grid-container');
      if (grid) {
        const items = grid.querySelectorAll(':scope > .grid-container__item');
        if (items.length > 0) {
          const title = items[0].querySelector('.cmp-title__text');
          if (title) contentEls.push(title);
        }
        if (items.length > 1) {
          const textBlock = items[1].querySelector('.cmp-text');
          if (textBlock) {
            // Add all direct children (paragraphs, headings, etc.)
            Array.from(textBlock.children).forEach(child => {
              contentEls.push(child);
            });
          }
        }
      }
    }
  }
  // Fallback: if no content found, use the element itself (should not happen, but safe)
  if (contentEls.length === 0) {
    contentEls = [element];
  }

  const contentRow = [contentEls];
  const cells = [headerRow, bgRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
