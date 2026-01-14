import DocumentHelper from "./documentHelper.mjs";

/**
 * Bind a DragDrop handler to a sheet.
 * Sensible defaults for dragstart, dragover and drop have been provided, that delegate to document type
 * specific callbacks like item and actor. The default folder callback uses a recursive pattern to make
 * callbacks for every document
 *
 * @param {Sheet} sheet which has the element the handler should be bound to.
 * @param {DragDropCallbacks} callbacks each handler will be invoked with this bound to sheet
 */
export function bindDragDrop(sheet, callbacks) {
  new DragDrop({
    dragSelector: "[data-drag]",
    dropSelector: null,
    callbacks: {
      dragstart: onDragStart,
      dragover: onDragOver,
      drop: onDrop,
    },
  }).bind(sheet.element);

  async function onDragStart(event) {
    if (callbacks.dragstart) return callbacks.dragstart.bind(sheet)(event);

    const data = await DocumentHelper.getItemFromHTML(event.currentTarget);
    event.dataTransfer.setData("text/plain", JSON.stringify(data.toDragData()));
  }

  function onDragOver(event) {
    if (callbacks.dragover) return callbacks.dragover.bind(sheet)(event);
  }

  async function onDrop(event, target) {
    if (callbacks.drop) return callbacks.drop.bind(sheet)(event, target);

    if (!sheet.document.isOwner) return false; // Cannot drag and drop into other people's sheets

    const data = TextEditor.getDragEventData(event);
    const doc = await getDocumentClass(data.type).implementation.fromDropData(
      data
    );

    return handleDrop({ type: data.type, doc, event, target });
  }

  async function handleDrop({ type, doc, event, target }) {
    const t = type.toLowerCase();
    if (callbacks[t]) return callbacks[t].bind(sheet)(doc);

    if (t === "folder") {
      return expandDrop({ folder, event, target });
    }
    throw new Error(
      `${sheet.constructor.name} has no drop handler for ${type}`
    );
  }

  async function expandDrop({ folder, event, target }) {
    folder.children.forEach(async (subFolder) => {
      await expandDrop({ folder: subFolder.folder, event, target });
    });
    folder.contents.map(async (doc) => {
      handleDrop({ type: folder.type, doc, event, target });
    });
  }
}
