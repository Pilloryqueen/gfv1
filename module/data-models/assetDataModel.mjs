import { defaultPlaybook, playbookTypes } from "./playbookDataModel.mjs";

const { BooleanField, HTMLField, StringField } = foundry.data.fields;

const TypeDataModel = foundry.abstract.TypeDataModel;

const schema = {
  description: new HTMLField(),
  playbookType: new StringField({
    required: true,
    initial: defaultPlaybook,
    choices: playbookTypes,
  }),
  damaged: new BooleanField(),
  void: new BooleanField(),
};

export class AssetDataModel extends TypeDataModel {
  static defineSchema() {
    return schema;
  }
}
