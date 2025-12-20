const TypeDataModel = foundry.abstract.TypeDataModel;

export default class BaseItemDataModel extends TypeDataModel {
  async prepareContext(context) {
    context.item = this.parent;
    context.system = this;
  }

  // define which properites to use in lists of this type
  static itemListProperties = [];

  static get label() {
    return this.propertyLabel("type");
  }

  static propertyLabel(property) {
    return game.i18n.localize(`GFv1.item.${this.type}.${property}`);
  }

  _properties = [];
  get properties() {
    return this._properties.map((p) => {
      return {
        label: game.i18n.localize(`GFv1.item.${this.parent.type}.${p}`),
        field: this.schema.fields[p],
        value: this[p],
      };
    });
  }
}
