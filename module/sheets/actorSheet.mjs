import AssetDataModel from "../data-models/items/assetDataModel.mjs";
import BondDataModel from "../data-models/items/bondDataModel.mjs";
import IdentityDataModel from "../data-models/items/identityDataModel.mjs";
import TagDataModel from "../data-models/items/tagDataModel.mjs";
import DialogHelper from "../util/dialogHelper.mjs";
import DocumentHelper from "../util/documentHelper.mjs";
import fromUuid from "../util/uuid.mjs";
import ItemList from "./elements/itemList.mjs";

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
        makeRoll: this._roll,
        toggleEdit: this._toggleEdit,
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
      window: {
        resizable: true,
      },
      position: {
        width: 600,
        height: 800,
      },
    };
  }

  get title() {
    if (this.actor.system.pronouns) {
      return `${this.actor.name} (${this.actor.system.pronouns})`;
    }
    return this.actor.name;
  }

  _locked = true;
  tabs = {};

  /** @override */
  _configureRenderOptions(options) {
    super._configureRenderOptions(options);
  }

  /** @inheritDoc */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    await this.document.system.prepareContext(context);

    context.locked = this._locked;
    context.editable = this.isEditable;

    context.fields = this.document.schema.fields;
    context.systemFields = this.document.system.schema.fields;

    context.tabs = this._prepareTabs(options.defaultTab);

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
    const item = await DocumentHelper.getItemFromHTML(
      event.target,
      this.actor.items
    );
    let value = event.target.value;
    if (event.target.type === "checkbox") value = event.target.checked;
    let name = event.target.name;
    if (name.startsWith("item.")) {
      name = name.replace(/item\./, "");
    } else {
      console.warn(`GFV1 | Prefer disambiguated name 'item.${name}'`);
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

  async _onDragStart(event) {
    const data = await DocumentHelper.getItemFromHTML(event.currentTarget);
    event.dataTransfer.setData("text/plain", JSON.stringify(data.toDragData()));
  }

  _onDragOver(event) {}

  async _onDrop(event, target) {
    if (!this.actor.isOwner) return false; // Cannot drag and drop into other people's sheets
    const data = TextEditor.getDragEventData(event);
    const doc = await getDocumentClass(data.type).implementation.fromDropData(
      data
    );

    switch (data.type) {
      case "Item":
        return this._onDropItem(doc);
      case "Folder":
        return this._onDropFolder(doc);
      default:
        throw new Error(`Unhandled data type: ${data.type}`);
    }
  }

  async _onDropFolder(folder) {
    if (folder.type !== "Item") {
      throw new Error(`Cannot handle folder of ${folder.type}`);
    }
    folder.children.forEach(async (subFolder) => {
      await this._onDropFolder(subFolder.folder);
    });
    folder.contents.map(async (item) => {
      item = await fromUuid(item.uuid);
      await this._onDropItem(item);
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
      default:
        throw new Error(`No drop handle for item type: ${item.type}`);
    }
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

  static _toggleEdit(event, _target) {
    event.preventDefault();
    this._locked = !this._locked;
    this.render(false);
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
    if (target.dataset.noItem !== undefined) {
      return DialogHelper.rollModifierQuery({ actor: this.actor });
    }
    const item = await DocumentHelper.getItemFromHTML(target);
    DialogHelper.rollModifierQuery({ actor: this.actor, item });
  }
}
