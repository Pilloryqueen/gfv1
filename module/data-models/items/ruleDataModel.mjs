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
      when: new StringField({ required: true, initial: "" }),
      bonus: new StringField({ required: true, initial: "" }),
      then: new StringField({ required: true, initial: "" }),
      high: new StringField({ required: true, initial: "" }),
      med: new StringField({ required: true, initial: "" }),
      low: new StringField({ required: true, initial: "" }),
    };
  }
}
