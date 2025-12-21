import DialogHelper from "./dialogHelper.mjs";
import fromUuid from "./uuid.mjs";

export default class DocumentHelper {
  /**
   * Fetches the document representing the containing HTML element
   *
   * @param {HTMLElement} target    The element subject to search
   * @returns {Promise<Item>}       The referenced Item if found
   */
  static async getItemFromHTML(target) {
    const uuid = this.getItemUuidFromHTML(target);
    if (!uuid) throw `Expected an item-uuid on ${target.closest("li")}`;
    return fromUuid(uuid);
  }

  static getItemUuidFromHTML(target) {
    return target.closest("li[data-item-uuid]")?.dataset.itemUuid;
  }

  /**
   * Renders an embedded document's sheet
   *
   * @param {PointerEvent} event   The originating click event
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
   * @protected
   */
  static async viewDoc(event, target) {
    const doc = await DocumentHelper.getItemFromHTML(target);
    return doc.sheet.render(true);
  }

  /**
   * handles item deletion
   *
   * @param {pointerevent} event   the originating click event
   * @param {htmlelement} target   the capturing html element which defined a [data-action]
   * @protected
   */
  static async deleteDoc(event, target) {
    const doc = await DocumentHelper.getItemFromHTML(target);
    const del = () => {
      return doc.delete();
    };

    if (event.shiftKey || target.dataset.skipConfirm) return del();

    if (await DialogHelper.confirmDelete(doc.type, doc.parent.name)) {
      return del();
    }
  }
}
