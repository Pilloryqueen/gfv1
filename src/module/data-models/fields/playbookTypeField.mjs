import { GFV1 } from "../../config.mjs";
const { StringField } = foundry.data.fields;

export default class PlaybookTypeField extends StringField {
  constructor(options) {
    options.initial = PlaybookTypeField.defaultPlaybook;
    options.choices = PlaybookTypeField.playbookTypes;

    return super(options);
  }

  static playbookTypes() {
    return GFV1.playbooks;
  }

  static defaultPlaybook() {
    return GFV1.defaultPlaybook;
  }
}
