/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get the direct gridlayoutcontainer
  const gridlayout = element.querySelector('.gridlayoutcontainer, [data-cmp-is="gridlayoutcontainer"]');
  if (!gridlayout) return;

  // The gridlayout has two grid-container__item children; left = image, right = content
  const gridItems = gridlayout.querySelectorAll(':scope > .grid-container__item');
  if (gridItems.length < 2) return;
  const imageCol = gridItems[0];
  const contentCol = gridItems[1];

  // Find image (SVG wrapped in <img>)
  // Use first <img> found in left column
  const image = imageCol.querySelector('img');

  // From the right/content column:
  // Title (h1, h2, h3, or .cmp-title__text), Paragraph, Button
  let heading = contentCol.querySelector('h1, h2, h3, .cmp-title__text');
  // if .cmp-title__text is a div, use the element itself
  if (heading && heading.classList.contains('cmp-title__text') && heading.children.length === 1 && heading.firstElementChild.tagName.match(/^H[1-6]$/)) {
    heading = heading.firstElementChild;
  }
  const paragraph = contentCol.querySelector('p');
  const button = contentCol.querySelector('a.cmp-button');

  // Compose third-row content; only include if exists
  const contentArr = [];
  if (heading) contentArr.push(heading);
  if (paragraph) contentArr.push(paragraph);
  if (button) contentArr.push(button);

  // Table structure: header, image, content
  const cells = [
    ['Hero (hero6)'],
    [image ? image : ''],
    [contentArr.length ? contentArr : '']
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
