import BaseItemDataModel from "../baseItemDataModel.mjs";

const { HTMLField, BooleanField } = foundry.data.fields;

export default class IdentityDataModel extends BaseItemDataModel {
  static type = "identity";
  static defineSchema() {
    return {
      marked: new BooleanField({ required: true, initial: false }),
      description: new HTMLField(),
    };
  }
  static itemListProperties = ["marked"];
  _properties = ["marked"];
}
