/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the main navigation list containing all tabs
  const navList = element.querySelector('nav ul.cmp-megamenu__nav-list');
  if (!navList) return;

  // Collect all tab list items
  const tabLis = Array.from(navList.children).filter(li => li.matches('li.cmp-megamenu__nav-item'));

  const tabLabels = [];
  const tabContents = [];

  tabLis.forEach(li => {
    // 1. Tab Label: The text in the button (remove icons/whitespace)
    const button = li.querySelector('button.cmp-megamenu__nav-trigger');
    let label = '';
    if (button) {
      // Only keep the main text content (omit any icons or elements)
      label = '';
      button.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) label += node.textContent;
      });
      label = label.trim();
    }
    tabLabels.push(label);

    // 2. Tab Content: The .cmp-megamenu__panel, but not --search
    let panel = li.querySelector('.cmp-megamenu__panel:not(.cmp-megamenu__panel--search)');
    if (!panel) {
      // If not found, check for the search panel
      panel = li.querySelector('.cmp-megamenu__panel.cmp-megamenu__panel--search');
    }
    // Use the panel as-is for the cell (do not clone)
    if (panel) {
      tabContents.push(panel);
    } else {
      // Fallback: put in an empty div to preserve cell count
      tabContents.push(document.createElement('div'));
    }
  });

  // Compose the table: first row is ["Tabs"], then each tab is [label, content]
  const cells = [];
  cells.push(['Tabs']);
  for (let i = 0; i < tabLabels.length; i++) {
    cells.push([
      tabLabels[i],
      tabContents[i]
    ]);
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
