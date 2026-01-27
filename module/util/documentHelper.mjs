import DialogHelper from "./dialogHelper.mjs";
import { HtmlElementError } from "./error.mjs";
import Socket from "./socket.mjs";
import fromUuid from "./uuid.mjs";

export default class DocumentHelper {
  /**
   * Fetches the document representing the containing HTML element
   *
   * @param {HTMLElement} target    The element subject to search
   * @returns {Promise<Item>}       The referenced Item if found
   */
  static async getItemFromHtml(target) {
    const uuid = this.getItemUuidFromHtml(target);
    if (!uuid) {
      if (target.closest("li")) {
        throw new HtmlElementError(
          target.closest("li"),
          "Expected [data-item-uuid]",
        );
      }
      throw new HtmlElementError(target, "Not part of an item list");
    }
    return fromUuid(uuid);
  }

  static getItemUuidFromHtml(target) {
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
    const doc = await DocumentHelper.getItemFromHtml(target);
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
    const doc = await DocumentHelper.getItemFromHtml(target);
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
    console.log("change");
    const item = await DocumentHelper.getItemFromHtml(event.target);
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

  /**
   * @param {DragEvent} event
   * @returns {Promise<{
   *   documents: Array<Doc<T>>
   *   type: string
   * }>}
   */
  static async getDocumentsFromDropEvent(event) {
    const data = TextEditor.getDragEventData(event);
    let type = data.type;
    const root = await getDocumentClass(type).implementation.fromDropData(data);
    if (type !== "Folder") {
      return { type, documents: [root] };
    }
    type = root.type;
    const documents = this.documentsFromFolder(root);
    return { type, documents };
  }

  /**
   *
   * @param {Folder<Doc<T>>} folder
   * @returns {Array<Doc<T>>}
   */
  static documentsFromFolder(folder) {
    const documents = folder.children.flatMap((child) => {
      return this.documentsFromFolder(child.folder);
    });
    return documents.concat(folder.contents);
  }
}
