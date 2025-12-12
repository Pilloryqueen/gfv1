import BaseItemDataModel from "./baseItemDataModel.mjs";
import { PlaybookTypeField } from "./playbookDataModel.mjs";

const { BooleanField, HTMLField } = foundry.data.fields;


const schema = {
  description: new HTMLField(),
  playbookType: new PlaybookTypeField({
    required: true,
  }),
  damaged: new BooleanField(),
  void: new BooleanField(),
};

export class AssetDataModel extends BaseItemDataModel {
  static defineSchema() {
    return schema;
  }
}
