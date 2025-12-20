import { preloadedTemplates } from "../../handlebars/preload.mjs";
import { deleteDoc, embraceTag, makeRoll, viewDoc } from "./itemControl.mjs";

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
        (p) => new Prop(this.dataModel, this.item, p)
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

class Prop {
  constructor(dataModel, item, property) {
    this.dataModel = dataModel;
    this.item = item;
    this.property = property;
  }

  render(_) {
    const element = this.dataModel.schema.fields[this.property].toInput({
      label: `GFv1.item.${this.dataModel.type}.${this.property}`,
      field: this.dataModel.schema.fields[this.property],
      name: `item.system.${this.property}`,
      value: this.item.system[this.property],
      item: this.item,
      localize: true,
    });
    element.className += "item-input";
    return element.outerHTML;
  }
}
