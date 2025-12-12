const TypeDataModel = foundry.abstract.TypeDataModel;

export default class BaseItemDataModel extends TypeDataModel {
  async prepareContext(context) {
    context.item = this.parent;
    context.system = this;
  }
}
