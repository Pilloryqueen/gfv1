import BaseItemDataModel from "../baseItemDataModel.mjs";

const { HTMLField, BooleanField } = foundry.data.fields;

const schema = {
  marked: new BooleanField({ required: true, initial: false }),
  description: new HTMLField(),
};

export default class IdentityDataModel extends BaseItemDataModel {
  static defineSchema() {
    return schema;
  }

  _properties = ["marked"];
}
