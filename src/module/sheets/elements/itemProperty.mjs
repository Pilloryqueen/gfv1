import DocumentHelper from "../../util/documentHelper.mjs";

export default class ItemProperty {
  constructor(dataModel, item, property) {
    this.dataModel = dataModel;
    this.item = item;
    this.property = property;
  }

  render({ editable }) {
    if (DocumentHelper.canObserverEdit(this.item)) {
      editable = true;
    }
    const element = this.dataModel.schema.fields[this.property].toInput({
      label: `GFv1.item.${this.dataModel.type}.${this.property}`,
      field: this.dataModel.schema.fields[this.property],
      name: `item.system.${this.property}`,
      value: this.item.system[this.property],
      item: this.item,
      localize: true,
      disabled: !editable,
    });
    element.classList.add("item-input");
    element.classList.add("item-prop");
    return element.outerHTML;
  }
}
