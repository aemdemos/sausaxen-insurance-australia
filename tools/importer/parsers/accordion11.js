/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main accordion block within the provided element
  const accordion = element.querySelector('.accordion .cmp-accordion');
  if (!accordion) return;

  // Prepare header row as per the example
  const cells = [['Accordion']];

  // Select all accordion items
  const items = accordion.querySelectorAll(':scope > .cmp-accordion__item');
  items.forEach(item => {
    // Extract the title text from the button's .cmp-accordion__title
    let titleText = '';
    const primaryTitle = item.querySelector(
      '.cmp-accordion__header > .cmp-accordion__button > .cmp-accordion__title'
    );
    if (primaryTitle) {
      titleText = primaryTitle.textContent.trim();
    } else {
      // fallback: get first .cmp-accordion__title
      const fallbackTitle = item.querySelector('.cmp-accordion__title');
      if (fallbackTitle) {
        titleText = fallbackTitle.textContent.trim();
      }
    }

    // Use a <p> element for the title, as in the Markdown example
    const titleEl = document.createElement('p');
    titleEl.textContent = titleText;

    // Extract the visible panel content for the accordion item
    // It may be a wrapper .container or .cmp-container etc. inside the panel
    let contentCell = null;
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      // Look for direct child containers to preserve structure
      // Use the first container-ish child, or fallback to panel's direct children
      let containerChild = panel.querySelector(':scope > .container, :scope > .cmp-container, :scope > .aem-Grid');
      if (!containerChild) {
        // Fallback: just use all children of the panel
        // If no children, use the panel itself
        if (panel.children.length > 0) {
          // Array.from for compatibility
          contentCell = Array.from(panel.children);
        } else {
          contentCell = [panel];
        }
      } else {
        contentCell = [containerChild];
      }
    }
    // Only add rows if both title and content are available
    if (titleEl && contentCell) {
      cells.push([titleEl, contentCell]);
    }
  });

  // Create the table using the provided DOMUtils method
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original accordion block with the new block table
  const accordionContainer = accordion.closest('.accordion');
  if (accordionContainer) {
    accordionContainer.replaceWith(block);
  }
}
