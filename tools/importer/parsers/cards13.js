/* global WebImporter */
export default function parse(element, { document }) {
  // Header row exactly as given in the example
  const headerRow = ['Cards (cards13)'];

  // Get the UL of cards (defensively)
  const list = element.querySelector('ul.cmp-article-preview-list');
  if (!list) return;

  const items = list.querySelectorAll('li.cmp-article-preview-list__item');
  const rows = [];

  items.forEach((item) => {
    // First cell: image element if present
    let imgEl = '';
    const imgContainer = item.querySelector('.cmp-article-preview-list__image-container');
    if (imgContainer) {
      const img = imgContainer.querySelector('img');
      if (img) imgEl = img;
    }

    // Second cell: structured text content
    const textContent = [];
    const contentContainer = item.querySelector('.cmp-article-preview-list__content-container');
    if (contentContainer) {
      // Text container for date, category, title
      const textContainer = contentContainer.querySelector('.cmp-article-preview-list__text-container');
      if (textContainer) {
        // Date
        const date = textContainer.querySelector('.cmp-article-preview-list__date');
        if (date && date.textContent.trim()) textContent.push(date);
        // Category
        const category = textContainer.querySelector('.cmp-article-preview-list__category');
        if (category && category.textContent.trim()) textContent.push(category);
        // Title (should be h3)
        const h3 = textContainer.querySelector('h3');
        if (h3 && h3.textContent.trim()) textContent.push(h3);
      }
      // Read more button
      const buttonContainer = contentContainer.querySelector('.cmp-article-preview-list__button-container');
      if (buttonContainer) {
        const a = buttonContainer.querySelector('a');
        if (a) textContent.push(a);
      }
      // Tag container (if present, collect all tags in a div)
      const tagContainer = contentContainer.querySelector('.cmp-article-preview-list__tag-container');
      if (tagContainer) {
        const tags = tagContainer.querySelectorAll('.cmp-article-preview-list__tag');
        if (tags.length) {
          const tagDiv = document.createElement('div');
          tags.forEach((tag, i) => {
            tagDiv.appendChild(tag);
            // Add a space between tags except after the last
            if (i < tags.length - 1) tagDiv.appendChild(document.createTextNode(' '));
          });
          textContent.push(tagDiv);
        }
      }
    }
    // Final cell: array of existing elements (if more than one) or a single node
    let textCell = '';
    if (textContent.length === 1) {
      textCell = textContent[0];
    } else if (textContent.length > 1) {
      textCell = textContent;
    }
    rows.push([imgEl, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  element.replaceWith(table);
}
