import { DialogHelper } from "../util/dialogHelper.mjs";
import { DocumentHelper } from "../util/documentHelper.mjs";

const HandlebarsApplicationMixin =
  foundry.applications.api.HandlebarsApplicationMixin;
const ActorSheetV2 = foundry.applications.sheets.ActorSheetV2;

export default class Gfv1ActorSheet extends HandlebarsApplicationMixin(
  ActorSheetV2
) {
  static ACTIONS = {};
  static PARTLIST = [];
  static LIMITED_PARTLIST = [];

  static get DEFAULT_OPTIONS() {
    const actions = foundry.utils.mergeObject(
      {
        editImage: this._onEditImage,
        createDoc: this._createDoc,
        viewDoc: DocumentHelper.viewDoc,
        deleteDoc: DocumentHelper.deleteDoc,
        roll: this._roll,
      },
      this.ACTIONS
    );
    return {
      tag: "form",
      classes: ["gfv1", "sheet", "actor-sheet"],
      actions,
      form: {
        submitOnChange: true,
        closeOnSubmit: false,
      },
      edit: true,
    };
  }

  get title() {
    return `${this.actor.name} (${this.actor.system.pronouns})`;
  }

  tabs = {};

  /** @override */
  _configureRenderOptions(options) {
    super._configureRenderOptions(options);
  }

  /** @inheritDoc */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    context.editable = this.edit;
    context.owned = this.isOwner;
    context.limited = this.limited;

    context.actor = this.actor;
    context.system = this.actor.system;

    context.fields = this.document.schema.fields;
    context.systemFields = this.document.system.schema.fields;

    context.tabs = this._prepareTabs(options.defaultTab);

    const items = this.document.itemTypes;
    context.identities = items.identity;
    context.tags = items.tag;
    context.bonds = items.bond;
    return context;
  }

  async _preparePartContext(partId, context) {
    const tab = this.tabs[partId];
    if (tab) {
      context.tab = context.tabs[partId];
    }
    return context;
  }

  /** @inheritdoc */
  _onRender(context, options) {
    super._onRender();

    this.element.querySelectorAll(".item-input").forEach((d) => {
      d.addEventListener("change", this._onResourceChange.bind(this));
    });

    new DragDrop({
      dragSelector: "[data-drag]",
      dropSelector: null,
      permissions: {
        dragStart: this._canDragStart.bind(this),
        drop: this._canDrop.bind(this),
      },
      callbacks: {
        dragstart: this._onDragStart.bind(this),
        dragover: this._onDragOver.bind(this),
        drop: this._onDrop.bind(this),
      },
    }).bind(this.element);
  }

  async _onResourceChange(event) {
    event.preventDefault();
    const item = DocumentHelper.getItemFromHTML(event.target, this.actor.items);
    let value = event.target.value;
    if (event.target.type === "checkbox") value = event.target.checked;
    let name = event.target.name;
    if (name.startsWith("item.")) {
      name = name.replace(/item\./, "");
    } else {
      console.warn(`Prefer disambiguated name 'item.${name}'`);
    }
    const updateData = {};
    updateData[name] = value;
    return item.update(updateData);
  }

  /**
   * Tabs
   */
  _prepareTabs(defaultTab, tabGroup = "primary") {
    if (!this.tabGroups[tabGroup]) this.tabGroups[tabGroup] = defaultTab;

    return Object.keys(this.tabs).reduce((tabs, id) => {
      const tab = { id: id };
      const partial = this.tabs[id];
      foundry.utils.mergeObject(tab, partial);
      if (this.tabGroups[tabGroup] === id) tab.active = "active";
      tabs[id] = tab;
      return tabs;
    }, {});
  }

  /**
   * Drag and drop
   */

  _canDragStart(candidate) {
    return true;
  }

  _canDrop(candidate) {
    return true;
  }

  _onDragStart(event) {}

  _onDragOver(event) {}

  async _onDrop(event, target) {
    if (!this.actor.isOwner) return false; // Cannot drag and drop into other people's sheets
    const data = await TextEditor.getDragEventData(event);
    const docClass = await getDocumentClass(data.type);
    const doc = await docClass.implementation.fromDropData(data);

    switch (data.type) {
      case "Item":
        return this._onDropItem(doc);
      case "Folder":
        return this._onDropFolder(doc);
    }
  }

  async _onDropFolder(folder) {
    if (folder.type !== "Item")
      return Promise.reject(`Cannot handle folder of ${folder.type}`);
    const recur = Promise.allSettled(
      folder.children.map((subFolder) => {
        return this._onDropFolder(subFolder.folder);
      })
    );

    const data = Promise.allSettled(
      folder.contents.map((item) => {
        return this._onDropItem(item);
      })
    );

    return Promise.all([recur, data]).then(([recur, data]) => {
      return data.concat(recur);
    });
  }

  async _onDropItem(item) {
    switch (item.type) {
      case "rule":
      case "tag":
      case "identity":
      case "asset":
      case "bond":
        return this.actor.system.addItems([item]);
      case "playbook":
        return this.actor.system.importPlaybook(item);
    }
    return Promise.reject(`no handler for item ${item.name} (${item.type})`);
  }

  /**
   * Actions
   */

  /**
   * Handle changing a Document's image.
   * @this Gfv1ActorSheet
   * @param {PointerEvent} _event   The originating click event
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
   * @returns {Promise}
   * @protected
   */
  static async _onEditImage(_event, target) {
    if (target.nodeName !== "IMG") {
      throw new Error(
        "The editImage action is available only for IMG elements."
      );
    }
    const attr = target.dataset.edit;
    const current = foundry.utils.getProperty(this.document._source, attr);
    const defaultArtwork =
      this.document.constructor.getDefaultArtwork?.(this.document._source) ??
      {};
    const defaultImage = foundry.utils.getProperty(defaultArtwork, attr);
    const fp = new FilePicker({
      current,
      type: "image",
      redirectToRoot: defaultImage ? [defaultImage] : [],
      callback: (path) => {
        target.src = path;
        if (this.options.form.submitOnChange) {
          const submit = new Event("submit");
          this.element.dispatchEvent(submit);
        }
      },
      top: this.position.top + 40,
      left: this.position.left + 10,
    });
    await fp.browse();
  }

  /**
   * Handle creating a new Owned Item or ActiveEffect for the actor using initial data defined in the HTML dataset
   *
   * @this Gfv1ActorSheet
   * @param {PointerEvent} _event   The originating click event
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
   * @private
   */
  static async _createDoc(_event, target) {
    // Prepare the document creation data by initializing it a default name.
    const docData = {
      name: Item.defaultName({
        // defaultName handles an undefined type gracefully
        type: target.dataset.type,
        parent: this.actor,
      }),
    };
    // Loop through the dataset and add it to our docData
    for (const [dataKey, value] of Object.entries(target.dataset)) {
      if (["action", "documentClass"].includes(dataKey)) continue;
      foundry.utils.setProperty(docData, dataKey, value);
    }

    // Finally, create the embedded document!
    return Item.create(docData, { parent: this.actor });
  }

  /**
   * handles rolling
   *
   * @this Gfv1ActorSheet
   * @param {pointerevent} _event   the originating click event
   * @param {htmlelement} target   the capturing html element which defined a [data-action]
   * @protected
   */
  static async _roll(_event, target) {
    const item = await DocumentHelper.getItemFromHTML(target);
    DialogHelper.rollModifierQuery({ actor: this.actor, item });
  }
}
