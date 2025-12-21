import { preloadedTemplates } from "../../handlebars/preload.mjs";
import { deleteDoc, embraceTag, makeRoll, viewDoc } from "./itemControl.mjs";
import ItemProperty from "./itemProperty.mjs";

export default class ListItem {
  constructor(dataModel, item) {
    this.dataModel = dataModel;
    this.item = item;
  }

  render({ actor, locked, playbookType, editable }) {
    const context = {
      item: this.item,
      uuid: this.item.uuid,
      properties: this.dataModel.itemListProperties.map(
        (p) => new ItemProperty(this.dataModel, this.item, p)
      ),
      type: this.dataModel.type,
      controls: controls,
      actor,
      locked,
      playbookType,
      editable,
    };
    return preloadedTemplates.itemListEntry(context);
  }
}

const controls = [makeRoll, embraceTag, viewDoc, deleteDoc];
