import BaseItemDataModel from "../baseItemDataModel.mjs";
import PlaybookTypeField from "../fields/playbookTypeField.mjs";

const { BooleanField, HTMLField } = foundry.data.fields;

export default class AssetDataModel extends BaseItemDataModel {
  static type = "asset";
  static defineSchema() {
    return {
      description: new HTMLField(),
      playbookType: new PlaybookTypeField({
        required: true,
      }),
      damaged: new BooleanField(),
      void: new BooleanField(),
    };
  }

  static itemListProperties = ["damaged", "void"];
  _properties = ["damaged", "void"];
}
