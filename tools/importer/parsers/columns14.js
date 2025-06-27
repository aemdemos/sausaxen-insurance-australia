/* global WebImporter */
export default function parse(element, { document }) {
  // The given HTML is only a separator div. There is no actual content to extract for a Columns block.
  // According to the example, this block would be translated as an empty columns block (with a single header and an empty cell for spacer).
  // There is no Section Metadata block in the example, so we should not output one.
  // The table header must match EXACTLY: 'Columns (columns14)'.
  // We should use an empty string as the single cell to preserve spacing. No cloning or content to reference is needed.
  const table = WebImporter.DOMUtils.createTable([
    ['Columns (columns14)'],
    [''],
  ], document);
  element.replaceWith(table);
}