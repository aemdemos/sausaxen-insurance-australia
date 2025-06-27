/* global WebImporter */
export default function parse(element, { document }) {
  // This HTML is just a separator (<hr>) in a wrapper div, not a data table.
  // To preserve the semantic meaning, we place the <hr> inside a block table as the only content row, using the correct header.

  const headerRow = ['Table (striped, bordered)'];
  // Find the first <hr> descendant in this block, to use as the visual separator
  let hr = element.querySelector('hr');
  if (!hr) {
    // fallback: if no <hr> is present, use the entire element
    hr = element;
  }
  const rows = [
    headerRow,
    [hr]
  ];
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
