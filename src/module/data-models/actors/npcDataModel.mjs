import BaseActorDataModel from "../baseActorDataModel.mjs";

const { HTMLField, StringField } = foundry.data.fields;

const schema = {
  description: new HTMLField(),
  pronouns: new StringField({ required: true, initial: "" }),
};

export default class NpcDataModel extends BaseActorDataModel {
  static defineSchema() {
    return schema;
  }

  allowedPlaybookTypes = [];
  allowedItemTypes = [];
}
