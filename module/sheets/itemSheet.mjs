import RuleDataModel from "../data-models/items/ruleDataModel.mjs";
import DocumentHelper from "../util/documentHelper.mjs";
import ItemList from "./elements/itemList.mjs";

const HandlebarsApplicationMixin =
  foundry.applications.api.HandlebarsApplicationMixin;
const ItemSheetV2 = foundry.applications.sheets.ItemSheetV2;

export default class Gfv1ItemSheet extends HandlebarsApplicationMixin(
  ItemSheetV2
) {
  static DEFAULT_OPTIONS = {
    tag: "form",
    classes: ["gfv1", "sheet", "item-sheet"],
    form: {
      submitOnChange: true,
      closeOnSubmit: false,
    },
    actions: {
      editImage: this._onEditImage,
      createBond: this._createBond,
      deleteBond: this._deleteBond,
      createAsset: this._createAsset,
      deleteAsset: this._deleteAsset,
      viewDoc: DocumentHelper.viewDoc,
      deleteDoc: DocumentHelper.deleteDoc,
      removeRule: this._removeRule,
    },
    edit: true,
  };

  get title() {
    return `${this.item.type}: ${this.item.name}`;
  }

  static PARTS = {
    header: {
      template: "systems/gfv1/templates/item/header.hbs",
    },
    properties: {
      template: "systems/gfv1/templates/item/properties.hbs",
    },
    description: {
      template: "systems/gfv1/templates/item/description.hbs",
    },
    playbook: {
      template: "systems/gfv1/templates/item/playbook.hbs",
    },
    playFields: {
      template: "systems/gfv1/templates/item/playFields.hbs",
    },
  };

  /** @override */
  _configureRenderOptions(options) {
    super._configureRenderOptions(options);
    options.parts = ["header", "properties", "description"];

    if (this.document.limited) return;

    switch (this.item.type) {
      case "playbook":
        options.parts.push("playbook");
        break;
      case "rule":
        options.parts.push("playFields");
        break;
    }
  }

  /** @inheritDoc */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    await this.item.system.prepareContext(context);

    context.editable = this.isEditable;

    context.fields = this.document.schema.fields;
    context.systemFields = this.document.system.schema.fields;

    context.config = CONFIG.GFV1;
    return context;
  }

  /** @override */
  async _preparePartContext(partId, context) {
    switch (partId) {
      case "description":
        context.enrichedDescription = await TextEditor.enrichHTML(
          this.item.system.description,
          {
            secrets: this.document.isOwner,
            rollData: this.item.getRollData(),
            relativeTo: this.item,
          }
        );
        break;
      case "playbook":
        const rules = await this.item.system.getRules();
        context.rules = new ItemList(RuleDataModel, rules);
    }
    return context;
  }

  /** @override */
  _onRender(context, options) {
    this.element.querySelectorAll(".item-input").forEach((d) => {
      d.addEventListener("change", this._onResourceChange.bind(this));
    });

    this.element.querySelectorAll(".bond-name").forEach((d) => {
      d.addEventListener("change", this._renameBond.bind(this));
    });
    this.element.querySelectorAll(".asset-name").forEach((d) => {
      d.addEventListener("change", this._renameAsset.bind(this));
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
    const item = await DocumentHelper.getItemFromHTML(event.target, game.items);
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
    console.log("updating");
    return item.update(updateData);
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
    if (!this.item.isOwner) return false; // Cannot drag and drop into other people's sheets
    const data = TextEditor.getDragEventData(event);
    const doc = await getDocumentClass(data.type).implementation.fromDropData(
      data
    );

    switch (data.type) {
      case "Item":
        return this._onDropItem(doc);
      case "Folder":
        return this._onDropFolder(doc);
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
      await this._onDropItem(item);
    });
  }

  async _onDropItem(item) {
    switch (item.type) {
      case "rule":
        return this.item.system.addRule(item.uuid);
      default:
        throw new Error(`No drop handle for item type: ${item.type}`);
    }
  }

  /**
   * Actions
   */

  /**
   * Handle changing a Document's image.
   * @this Gfv1ItemSheet
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

  static _createBond(event, target) {
    const bonds = this.document.system.bonds;
    bonds.push(target.dataset.name);
    this.document.update({ system: { bonds } });
  }

  async _renameBond(event) {
    event.preventDefault();
    const target = event.target;
    const index = target.closest("li[data-index]").dataset.index;
    const bonds = this.document.system.bonds;
    bonds[index] = target.value;
    return this.document.update({ system: { bonds } });
  }

  static _deleteBond(event, target) {
    const index = target.closest("li[data-index]").dataset.index;
    const bonds = this.document.system.bonds;
    bonds.splice(index, 1);
    return this.document.update({ system: { bonds } });
  }

  static _createAsset(event, target) {
    const assets = this.document.system.assets;
    assets.push(target.dataset.name);
    this.document.update({ system: { assets } });
  }

  async _renameAsset(event) {
    event.preventDefault();
    const target = event.target;
    const index = target.closest("li[data-index]").dataset.index;
    const assets = this.document.system.assets;
    assets[index] = target.value;
    return this.document.update({ system: { assets } });
  }

  static _deleteAsset(event, target) {
    const index = target.closest("li[data-index]").dataset.index;
    const assets = this.document.system.assets;
    assets.splice(index, 1);
    return this.document.update({ system: { assets } });
  }

  static async _removeRule(event, target) {
    const index = target.closest("li[data-index]").dataset.index;
    this.document.system.deleteRule(index);
  }
}
