import BaseItemDataModel from "../baseItemDataModel.mjs";
import { GFV1 } from "../../config.mjs";

const { HTMLField, StringField } = foundry.data.fields;

const schema = {
  level: new StringField({
    required: true,
    initial: "npc",
    choices: GFV1.bondLevels,
  }),
  description: new HTMLField(),
};

export default class BondDataModel extends BaseItemDataModel {
  static defineSchema() {
    return schema;
  }

  _properties = ["level"];
}
