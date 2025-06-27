/* global WebImporter */
export default function parse(element, { document }) {
  // Find the first .grid-container
  const grid = element.querySelector(':scope > .grid-container');
  if (!grid) return;
  const gridItems = grid.querySelectorAll(':scope > .grid-container__item');
  if (gridItems.length < 2) return;

  // LEFT COLUMN: Save up to 10% online
  const leftGrid = gridItems[0];
  // The content we need is in .flex-item (title, separator, text), and the .cmp-button
  const mainContent = leftGrid.querySelector('.flex-item');
  const button = leftGrid.querySelector('.cmp-button');
  const leftColContent = [];
  if (mainContent) leftColContent.push(mainContent);
  if (button) leftColContent.push(button);

  // RIGHT COLUMN: Did you know ...
  const rightGrid = gridItems[1];
  // Find the nested .grid-container for image and text
  const nestedGrid = rightGrid.querySelector(':scope .grid-container');
  let imageCell = null, textCell = null;
  if (nestedGrid) {
    const nestedItems = nestedGrid.querySelectorAll(':scope > .grid-container__item');
    if (nestedItems.length >= 2) {
      // Image in first nested item
      imageCell = nestedItems[0].querySelector('.cmp-image');
      // Text/title in second nested item
      textCell = nestedItems[1].querySelector('.flex');
    }
  }
  const rightColContent = [];
  if (imageCell) rightColContent.push(imageCell);
  if (textCell) rightColContent.push(textCell);

  // Build columns block table
  const headerRow = ['Columns (columns9)'];
  const cells = [
    headerRow,
    [leftColContent, rightColContent]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
