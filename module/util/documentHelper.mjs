export class DocumentHelper {
  /**
   * Fetches the document representing the containing HTML element
   *
   * @param {HTMLElement} target    The element subject to search
   * @param {[Item]} items          Items to search through (such as for embedded items)
   * @returns {Item | undefined}    The referenced Item if found
   */
  static getItemFromHTML(target, items = game.items) {
    if (target.dataset.itemId) {
      return items.get(target.dataset.itemId);
    }
    const docRow = target.closest("li[data-item-id]");
    if (!docRow) return;
    return items.get(docRow.dataset.itemId);
  }
}
