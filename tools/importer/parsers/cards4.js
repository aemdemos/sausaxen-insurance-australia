/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Cards (cards4)'];
  // Select all card items (direct children of grid)
  const cardNodes = element.querySelectorAll(':scope > div > div.grid-container__item');
  const rows = [headerRow];
  cardNodes.forEach(cardNode => {
    // The content for this card is inside .flexlayoutcontainer or .flex--bg-white
    const flex = cardNode.querySelector('.flexlayoutcontainer') || cardNode.querySelector('.flex--bg-white');
    let cardContent = [];
    // Title (should be a heading with link inside)
    const title = flex && flex.querySelector('.cmp-title__text');
    if (title) cardContent.push(title);
    // Description (the <p> under .cmp-text)
    const desc = flex && flex.querySelector('.cmp-text p');
    if (desc) cardContent.push(desc);
    // Button group (contains action links)
    const btnGroup = flex && flex.querySelector('.buttongroup .cmp-container');
    if (btnGroup) cardContent.push(btnGroup);
    rows.push(['', cardContent]); // First cell reserved for image/icon (none present)
  });
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}