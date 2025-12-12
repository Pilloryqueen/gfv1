import BaseItemDataModel from "./baseItemDataModel.mjs";

const { HTMLField, BooleanField } = foundry.data.fields;

const schema = {
  marked: new BooleanField({ required: true, initial: false }),
  description: new HTMLField(),
};

export class TagDataModel extends BaseItemDataModel {
  static defineSchema() {
    return schema;
  }
}
