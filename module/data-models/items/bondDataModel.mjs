import BaseItemDataModel from "../baseItemDataModel.mjs";
import { GFV1 } from "../../config.mjs";

const { HTMLField, StringField } = foundry.data.fields;

export default class BondDataModel extends BaseItemDataModel {
  static type = "bond";
  static defineSchema() {
    return {
      level: new StringField({
        required: true,
        initial: "npc",
        choices: GFV1.bondLevels,
      }),
      description: new HTMLField(),
    };
  }

  static itemListProperties = ["level"];
  _properties = ["level"];
}
