/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the visible (meaningful) content of a column
  function extractColumnContent(gridItem) {
    // Find the flexlayoutcontainer (column root)
    const flexContainer = gridItem.querySelector('.flexlayoutcontainer');
    if (!flexContainer) return gridItem;

    // We'll collect the image, title, and text contents
    const content = [];

    // Only reference direct children in the correct order
    // Image (SVG or IMG)
    const image = flexContainer.querySelector('.cmp-image');
    if (image) content.push(image);

    // Title
    const title = flexContainer.querySelector('.cmp-title');
    if (title) content.push(title);

    // Text
    const text = flexContainer.querySelector('.cmp-text');
    if (text) content.push(text);

    // Combine content for this column
    if (content.length === 0) {
      return document.createTextNode('');
    } else if (content.length === 1) {
      return content[0];
    } else {
      return content;
    }
  }

  // Get all direct children with class grid-container__item (the columns)
  const columns = Array.from(element.querySelectorAll(':scope > .grid-container__item'));

  // If no columns, do nothing
  if (columns.length === 0) return;

  // Extract content for each column
  const colCells = columns.map(extractColumnContent);

  // Compose the block table rows
  const headerRow = ['Columns (columns8)'];
  const blockRows = [headerRow, colCells];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(blockRows, document);

  // Replace the original element with the table
  element.replaceWith(table);
}
