import { preloadedTemplates } from "../../handlebars/preload.mjs";
import { createDoc } from "./itemControl.mjs";
import ItemEntry from "./itemEntry.mjs";

export default class ItemList {
  constructor(dataModel, items) {
    this.items = items;
    this.dataModel = dataModel;
  }

  get empty() {
    return this.items.length === 0;
  }

  render({ locked, max, playbookType, editable, actor, reorder }) {
    let items = this.items;
    if (reorder !== false) {
      items = items.sort((a, b) => a.sort - b.sort);
    }
    const context = {
      name: this.dataModel.label,
      items: items.map((item) => new ItemEntry(this.dataModel, item)),
      properties: this.dataModel.itemListProperties.map(
        this.dataModel.propertyLabel.bind(this.dataModel),
      ),
      type: this.dataModel.type,
      createDoc,
      locked,
      max,
      playbookType,
      editable,
      actor,
    };
    return preloadedTemplates.itemList(context);
  }
}
