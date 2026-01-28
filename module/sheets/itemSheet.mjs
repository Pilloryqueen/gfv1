import DocumentHelper from "../util/documentHelper.mjs";
import DragDropHandler from "../util/dragDrop.mjs";
import Gfv1Error from "../util/error.mjs";
import Tabs from "../util/tabs.mjs";

const HandlebarsApplicationMixin =
  foundry.applications.api.HandlebarsApplicationMixin;
const ItemSheetV2 = foundry.applications.sheets.ItemSheetV2;

const TABS = ["description", "item"];

export default class Gfv1ItemSheet extends HandlebarsApplicationMixin(
  ItemSheetV2,
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
      viewDoc: DocumentHelper.viewDoc,
      deleteDoc: this._deleteRef, // We only want to delete the reference not the doc itself
    },
    window: {
      resizable: true,
    },
    position: {
      width: 600,
      height: 800,
    },
  };

  get title() {
    return `${this.item.type}: ${this.item.name}`;
  }

  tabs = new Tabs(TABS, "description", "primary");

  static get PARTS() {
    return {
      header: {
        template: "systems/gfv1/templates/item/header.hbs",
      },
      ...Tabs.templates(TABS),
    };
  }

  /** @override */
  _configureRenderOptions(options) {
    super._configureRenderOptions(options);
    options.parts = ["header", "tabs", "description", "item"];
    if (this.document.limited) this.tabs.limitTabsTo(["description"]);
  }

  /** @inheritDoc */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    await this.document.system.prepareContext(context);

    context.editable = this.isEditable;

    context.fields = this.document.schema.fields;
    context.systemFields = this.document.system.schema.fields;

    context.tabs = this.tabs.contextData(this.tabGroups);
    return context;
  }

  /** @override */
  async _preparePartContext(partId, context) {
    context.tab = context.tabs[partId];

    switch (partId) {
      case "description":
        context.enrichedDescription = await TextEditor.enrichHTML(
          this.document.system.description,
          {
            secrets: this.document.isOwner,
            rollData: this.document.getRollData(),
            relativeTo: this.document,
          },
        );
        break;
    }
    return context;
  }

  /** @override */
  _onRender(context, options) {
    this.element.querySelectorAll(".item-input").forEach((d) => {
      d.addEventListener("change", DocumentHelper.onResourceChange.bind(this));
    });

    new DragDropHandler(this, {
      item: this._onDropItems,
      internal: this._onItemSort,
    });
  }

  async _onItemSort({ sortedItems }) {
    return this.item.system.reorderRefs(sortedItems);
  }

  async _onDropItems(items) {
    for (const item of items) {
      await this.item.system.addRef(item.uuid);
    }
  }

  /**
   * Actions
   */

  /**
   * Handle changing a Document's image.
   * @this Gfv1ItemSheet
   * @param {PointerEvent} event   The originating click event
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
   * @returns {Promise}
   * @protected
   */
  static async _onEditImage(event, target) {
    if (target.nodeName !== "IMG") {
      throw new Gfv1Error(
        "The editImage action is available only for IMG elements.",
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

  static async _deleteRef(event, target) {
    const uuid = DocumentHelper.getItemUuidFromHtml(target);
    return this.item.system.deleteRef(uuid);
  }
}
