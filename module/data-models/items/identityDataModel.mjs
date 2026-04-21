import BaseItemDataModel from "../baseItemDataModel.mjs";

const { HTMLField, BooleanField, StringField } = foundry.data.fields;

export default class IdentityDataModel extends BaseItemDataModel {
  static type = "identity";
  static defineSchema() {
    return {
      tooltip: new StringField({ required: true, initial: "" }),
      description: new HTMLField(),
      marked: new BooleanField({ required: true, initial: false }),
    };
  }
  static itemListProperties = ["marked"];
  _properties = ["marked"];
}
