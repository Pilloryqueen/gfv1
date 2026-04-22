import BaseItemDataModel from "../baseItemDataModel.mjs";
import PlaybookTypeField from "../fields/playbookTypeField.mjs";

const { HTMLField, BooleanField, StringField } = foundry.data.fields;

export default class RuleDataModel extends BaseItemDataModel {
  static type = "rule";
  static defineSchema() {
    return {
      tooltip: new StringField({ required: true, initial: "" }),
      description: new HTMLField(),
      play: new BooleanField({ required: true, initial: false }),
      playbookType: new PlaybookTypeField({
        required: true,
      }),
      heat: new BooleanField({ required: true, initial: true }),
      high: new StringField(),
      med: new StringField(),
      low: new StringField(),
    };
  }
}
