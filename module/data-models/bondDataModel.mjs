import BaseItemDataModel from "./baseItemDataModel.mjs";

const { HTMLField, StringField } = foundry.data.fields;

const schema = {
  level: new StringField({ required: true, initial: "npc" }),
  description: new HTMLField(),
};

export class BondDataModel extends BaseItemDataModel {
  static defineSchema() {
    return schema;
  }
}
