/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in the example
  const headerRow = ['Cards (cards12)'];
  const rows = [headerRow];

  // Find all card root items (direct children with .grid-container__item)
  const cardNodes = element.querySelectorAll(':scope > .gridlayoutcontainer > .grid-container > .grid-container__item');

  cardNodes.forEach((cardNode) => {
    // CARD layout: No image (1st cell is empty string), 2nd cell is stack of title, description, button
    const cellContent = [];

    // Title: h3
    const title = cardNode.querySelector('h3');
    if (title) cellContent.push(title);

    // Description: first <p> in cmp-text
    const desc = cardNode.querySelector('.cmp-text p');
    if (desc) cellContent.push(desc);

    // CTA: find first button (a.cmp-button)
    // Only include it if it has visible text (avoid disabled empty links)
    const button = cardNode.querySelector('a.cmp-button');
    if (button && button.textContent.trim() !== '') cellContent.push(button);

    // If everything is missing, fallback to empty string to avoid empty cell
    rows.push(['', cellContent.length > 0 ? cellContent : '']);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
