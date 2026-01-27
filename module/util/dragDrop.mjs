import Gfv1ActorSheet from "../sheets/actorSheet.mjs";
import DocumentHelper from "./documentHelper.mjs";

const LIST_QUERY = ".items-list";
const ITEM_QUERY = ".item";

class DragFlow {
  /**
   * Represents the flow of dragging one item around
   * @param {Doc<Item>} data Item being moved
   * @param {HTMLElement} source List Item Element being moved
   * @param {HTMLElement} list List Element item is being moved in
   * @param {Gfv1ActorSheet} sheet Sheet the drag originated from
   */
  constructor(data, source, list, sheet) {
    this.sheet = sheet;
    /** @type {HTMLElement} */
    this.source = source;
    /** @type {HTMLElement} */
    this.listElement = list;
    /** @type {NodeListOf<Element>} */
    this.listItems = list.querySelectorAll(ITEM_QUERY);
    this.data = data;
    this.events = new Map();
    /** @type {HTMLElement | null} */
    this.target = null;
  }

  setTarget(newTarget) {
    if (this.target) {
      this.target.classList.remove("drag-target");
    }
    this.target = newTarget;
    if (this.target) {
      this.target.classList.add("drag-target");
      this.target.after(this.source);
    }
  }

  /**
   * @param {HTMLElement} li
   * @param {DragEvent} event
   */
  dragEnter(li, event) {
    this.setTarget(li);
  }

  /**
   * @param {DragEvent} event
   */
  async drop(event) {
    this.dropped = true; // don't double render in end!

    const sortedItems = [];
    // new query to ensure updated order
    this.listElement.querySelectorAll("[data-item-uuid]").forEach((li) => {
      sortedItems.push(li.dataset.itemUuid);
    });
    if (this.target.dataset.itemUuid === undefined) {
      // Target is header. Sort to top
      const targetElement = this.listElement.querySelector(
        "li:not(.drag-target, .drag-moving)",
      );
      return {
        sortedItems,
        sourceElement: this.source,
        targetElement,
        sortBefore: true,
      };
    }
    return {
      sortedItems,
      sourceElement: this.source,
      targetElement: this.target,
      sortBefore: false,
    };
  }

  /**
   * A drag is started for this flow
   * @param {DragEvent} event
   */
  start(event) {
    this.source.classList.add("drag-moving");
    this.listItems.forEach((li) => {
      this.registerEvents(li);
    });
  }

  /**
   * The drag flow has ended
   * @param {DragEvent} event
   */
  end(event) {
    this.source.classList.remove("drag-moving");
    this.listItems.forEach((li) => {
      this.removeEvents(li);
    });
    this.setTarget(null);
    if (!this.dropped) {
      // if it was dropped a re-render will happen once the sheet has updated
      this.sheet.render(false);
    }
  }

  /**
   * @param {HTMLElement} li
   */
  registerEvents(li) {
    const dragEnterHandler = (event) => {
      if (li.contains(event.relatedTarget)) {
        return false; // Still on an inner element
      }
      if (!li.classList.contains("drag-moving")) this.dragEnter(li, event);
      return true;
    };

    this.events.set(li, {
      dragEnterHandler,
    });

    li.addEventListener("dragenter", dragEnterHandler);
  }

  /**
   * @param {HTMLElement} li
   */
  removeEvents(li) {
    const { dragEnterHandler } = this.events.get(li);
    this.events.delete(li);

    li.removeEventListener("dragenter", dragEnterHandler);
  }
}

class DropFlow {
  constructor(sheet, dropHandlers) {
    this.dropHandlers = dropHandlers;
    this.sheet = sheet;
  }

  async internalDrop(event, dragFlow) {
    const f = this.dropHandlers.internal;
    if (!f)
      return console.warn(
        `GFV1 | ${this.sheet.constructor.name} has no drop handler for internal`,
      );
    return f.bind(this.sheet)(await dragFlow.drop(event));
  }

  async externalDrop(event) {
    const { documents, type } =
      await DocumentHelper.getDocumentsFromDropEvent(event);
    const f = this.dropHandlers[type.toLowerCase()];
    if (!f)
      return console.warn(
        `GFV1 | ${this.sheet.constructor.name} has no drop handler for ${type}`,
      );
    return f.bind(this.sheet)(documents);
  }
}

let GLOBAL_DRAG;

export default class DragDropHandler {
  constructor(sheet, dropHandlers) {
    this.dropFlow = new DropFlow(sheet, dropHandlers);

    /** @type {HTMLElement} */
    const html = sheet.element;

    if (sheet.document.isOwner) {
      html.addEventListener("drop", (event) => {
        event.stopPropagation();
        event.stopImmediatePropagation();
        if (GLOBAL_DRAG?.sheet === sheet) {
          this.dropFlow.internalDrop(event, GLOBAL_DRAG);
          return true;
        }
        this.dropFlow.externalDrop(event);
        return true;
      });
    }

    html.querySelectorAll("[data-drag]").forEach(async (element) => {
      element.setAttribute("draggable", true);
      const source = element.closest(ITEM_QUERY);
      const list = source.closest(LIST_QUERY);
      const data = await DocumentHelper.getItemFromHtml(source);

      element.addEventListener("dragstart", (event) => {
        event.stopPropagation();
        event.stopImmediatePropagation();
        event.dataTransfer.setDragImage(source, 0, 0);
        // for external drops
        event.dataTransfer.setData(
          "text/plain",
          JSON.stringify(data.toDragData()),
        );
        GLOBAL_DRAG = new DragFlow(data, source, list, sheet);
        GLOBAL_DRAG.start(event);
      });
      element.addEventListener("dragend", (event) => {
        event.stopPropagation();
        event.stopImmediatePropagation();
        GLOBAL_DRAG?.end(event);
        GLOBAL_DRAG = null;
      });
    });
  }
}
