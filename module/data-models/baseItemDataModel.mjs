const TypeDataModel = foundry.abstract.TypeDataModel;

export default class BaseItemDataModel extends TypeDataModel {
  async prepareContext(context) {
    context.item = this.parent;
    context.system = this;
  }

  _properties = [];

  get properties() {
    const properties = {};
    for (let p of this._properties) {
      properties[p] = `GFv1.item.${this.parent.type}.${p}`;
    }
    return this._properties.map((p) => {
      return {
        label: `GFv1.item.${this.parent.type}.${p}`,
        field: this.schema.fields[p],
        value: this[p],
      };
    });
  }
}
