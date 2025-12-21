export default class ItemProperty {
  constructor(dataModel, item, property) {
    this.dataModel = dataModel;
    this.item = item;
    this.property = property;
  }

  render({ editable }) {
    const element = this.dataModel.schema.fields[this.property].toInput({
      label: `GFv1.item.${this.dataModel.type}.${this.property}`,
      field: this.dataModel.schema.fields[this.property],
      name: `item.system.${this.property}`,
      value: this.item.system[this.property],
      item: this.item,
      localize: true,
      disabled: !editable,
    });
    element.className += "item-input";
    return element.outerHTML;
  }
}
