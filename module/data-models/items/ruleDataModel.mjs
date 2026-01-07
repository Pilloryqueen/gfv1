import BaseItemDataModel from "../baseItemDataModel.mjs";
import PlaybookTypeField from "../fields/playbookTypeField.mjs";

const { HTMLField, BooleanField, StringField } = foundry.data.fields;

export default class RuleDataModel extends BaseItemDataModel {
  static type = "rule";
  static defineSchema() {
    return {
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
  }
}

export class AdvancementDataModel extends RuleDataModel {
  static get label() {
    return this.propertyLabel("advancementType");
  }
}
