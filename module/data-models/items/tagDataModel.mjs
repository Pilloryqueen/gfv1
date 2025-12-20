import BaseItemDataModel from "../baseItemDataModel.mjs";

const { HTMLField, BooleanField } = foundry.data.fields;

const schema = {
  marked: new BooleanField({ required: true, initial: false }),
  description: new HTMLField(),
};

export default class TagDataModel extends BaseItemDataModel {
  static type = "tag";
  static defineSchema() {
    return schema;
  }
  static itemListProperties = ["marked"];
  _properties = ["marked"]
}
