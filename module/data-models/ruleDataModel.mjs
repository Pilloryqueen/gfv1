import { DialogHelper } from "../util/dialogHelper.mjs";
import { defaultPlaybook, playbookTypes } from "./playbookDataModel.mjs";

const { HTMLField, BooleanField, StringField } = foundry.data.fields;

const TypeDataModel = foundry.abstract.TypeDataModel;

const schema = {
  description: new HTMLField(),
  play: new BooleanField({ required: true, initial: false }),
  playbookType: new StringField({
    required: true,
    initial: defaultPlaybook,
    choices: playbookTypes,
  }),
  locked: new BooleanField({ required: true, initial: false }),
  heat: new BooleanField({ required: true, initial: true }),
  high: new StringField(),
  med: new StringField(),
  low: new StringField(),
};

export class RuleDataModel extends TypeDataModel {
  static defineSchema() {
    return schema;
  }

  async roll() {
  }
}
