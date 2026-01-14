import DialogHelper from "./dialogHelper.mjs";
import Socket from "./socket.mjs";
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
    if (!uuid) throw "Expected an item-uuid on <li>";
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
   * @param {PointerEvent} event   the originating click event
   * @param {HTMLElement} target   the capturing html element which defined a [data-action]
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

  // check if ObserverEdit is enabled.
  // If an item is given, additionally check if that item can be edited by a GM
  static canObserverEdit(item = undefined) {
    if (game.settings.get("gfv1", "observerEdit") === "deny") return false;
    if (item?.compendium?.locked) return false;
    if (!game.users.activeGM) return false;

    return true;
  }

  static async onResourceChange(event) {
    event.preventDefault();
    const item = await DocumentHelper.getItemFromHTML(event.target);
    let value = event.target.value;
    if (event.target.type === "checkbox") value = event.target.checked;
    let propertyName = event.target.name;
    if (propertyName.startsWith("item.")) {
      propertyName = propertyName.replace(/item\./, "");
    } else {
      console.warn(`GFV1 | Prefer disambiguated name 'item.${propertyName}'`);
    }
    const update = {};
    update[propertyName] = value;

    if (item.canUserModify(game.user, "update")) {
      return item.update(update);
    } else {
      event.target.disabled = true;
      event.target.classList.add("pending");
      try {
        await Socket.gmUpdate(item, update);
      } finally {
        event.target.disabled = false;
        event.target.classList.remove("pending");
        this.render();
      }
    }
  }
}
