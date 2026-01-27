export default class Gfv1Error extends Error {
  constructor(message) {
    const m = String(message);
    super(m);
    /** @type {String} message from origin */
    this.originMessage = m;
    /** @type {String} name of this error */
    this.name = this.constructor.name;
  }

  get message() {
    return `GFV1 | ${this.name}: ${this.originMessage}`;
  }
}

/**
 * Errors relating to SocketConnection.
 * SocketErrors raised during socket request handling is sent back to caller
 */
export class SocketError extends Gfv1Error {}

/**
 * Errors relating to rolling dice
 */
export class RollError extends Gfv1Error {}

/**
 * Errors relating to Tab selection
 */
export class TabError extends Gfv1Error {
  constructor(tabId) {
    super(`${tabId} is not a valid tab`);
  }
}

/**
 * Errors that relate to a specific HtmlElement such as an event target
 * Error message contains details about the Element to help identify it
 */
export class HtmlElementError extends Gfv1Error {
  /**
   * @param {HTMLElement} element
   * @param {String} message
   * @this HtmlElementError
   */
  constructor(element, message) {
    const elementDescription = `<${element.tagName} class="${element.classList.value}">`;
    super(`${message}\nFor: ${elementDescription}`);

    /** @type {HTMLElement} element this error relates to*/
    this.element = element;
  }
}

export class ImportError extends Gfv1Error {
  /**
   * @param {Doc<Item> | Array<Doc<Item>>} items errors attempted imported
   * @param {String} reason description of why these items cannot be imported
   * @param {Function | undefined} errorFunction called with each item to select which ones are in error
   * @this HtmlElementError
   */
  constructor(items, reason, errorFunction) {
    if (!Array.isArray(items)) items = [items];
    const itemCount = items.length;
    if (errorFunction) {
      items = items.filter(errorFunction);
    }
    super(
      `${items.map(describeItem).join(", ")} could not be imported: ${reason} (while importing ${itemCount} items)`,
    );

    function describeItem(item) {
      return `${item.type}:${item.name}`;
    }
  }
}
