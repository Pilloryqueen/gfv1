import BaseItemDataModel from "../baseItemDataModel.mjs";
import { PlaybookTypeField } from "./playbookDataModel.mjs";

const { HTMLField, BooleanField, StringField } = foundry.data.fields;

const schema = {
  description: new HTMLField(),
  play: new BooleanField({ required: true, initial: false }),
  playbookType: new PlaybookTypeField({
    required: true,
  }),
  locked: new BooleanField({ required: true, initial: false }),
  heat: new BooleanField({ required: true, initial: true }),
  high: new StringField(),
  med: new StringField(),
  low: new StringField(),
};

export default class RuleDataModel extends BaseItemDataModel {
  static defineSchema() {
    return schema;
  }

  _properties = ["playbookType"];
}
