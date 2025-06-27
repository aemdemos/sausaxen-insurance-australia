/* global WebImporter */
export default function parse(element, { document }) {
  // Get all card containers in the grid
  const grid = element.querySelector('div[data-cmp-is="gridlayoutcontainer"]');
  const cardNodes = grid ? grid.querySelectorAll(':scope > div.grid-container__item') : [];

  // Prepare rows: first row is the header, which must be a single cell
  const rows = [['Cards (cards7)']];

  cardNodes.forEach(card => {
    // Find the main flex column which contains all card content
    const flexContainer = card.querySelector('.flexlayoutcontainer');
    let flexCol = flexContainer ? flexContainer.querySelector('.flex.f-col') : null;
    if (!flexCol) flexCol = flexContainer;

    // Add a row: first cell is for image/icon (empty for this HTML), second is content
    rows.push(['', flexCol]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);

  // The createTable implementation will ensure the header row is a single cell, and content rows two cells, as required.
  element.replaceWith(table);
}
