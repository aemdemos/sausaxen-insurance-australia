/* global WebImporter */
export default function parse(element, { document }) {
  // Find the grid containing all columns
  const grid = element.querySelector('.grid');
  if (!grid) return;
  // Find all column wrappers
  const colDivs = Array.from(grid.children).filter(col => col.querySelector('.cmp-custom-columns__container'));

  // For each column, extract the main content block
  const columns = colDivs.map(col => {
    // Always select the inner .cmp-custom-columns__container
    const customCol = col.querySelector(':scope > .cmp-custom-columns__container');
    if (!customCol) return null;
    // Drill down to the main cmp-container
    let cmpContainer = customCol.querySelector(':scope > .container > .cmp-container');
    if (!cmpContainer) return customCol;
    // The actual content is usually the first child div
    let contentDiv = cmpContainer.querySelector(':scope > div');
    if (!contentDiv) return cmpContainer;
    // If only one child, return it, else return all children as an array
    if (contentDiv.children.length === 1) {
      return contentDiv.firstElementChild;
    } else {
      return Array.from(contentDiv.children);
    }
  });

  // Build the table: header row (one cell), then one row with N columns
  const cells = [
    ['Columns (columns15)'],
    columns
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
