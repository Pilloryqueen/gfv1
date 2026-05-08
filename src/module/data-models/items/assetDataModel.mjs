import BaseItemDataModel from "../baseItemDataModel.mjs";
import PlaybookTypeField from "../fields/playbookTypeField.mjs";

const { BooleanField, HTMLField, StringField } = foundry.data.fields;

export default class AssetDataModel extends BaseItemDataModel {
  static type = "asset";
  static defineSchema() {
    return {
      tooltip: new StringField({ required: true, initial: "" }),
      description: new HTMLField(),
      inLimit: new BooleanField({ required: true, initial: true }),
      playbookType: new PlaybookTypeField({
        required: true,
      }),
      damaged: new BooleanField(),
      void: new BooleanField(),
    };
  }

  static itemListProperties = ["damaged", "void"];
  _properties = ["damaged", "void", "inLimit"];
}
