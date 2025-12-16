import BaseItemDataModel from "../baseItemDataModel.mjs";

const { HTMLField, StringField, NumberField, ArrayField } = foundry.data.fields;

export default class GorgonClassDataModel extends BaseItemDataModel {
  static defineSchema() {
    return {
      description: new HTMLField(),
      apperance: new StringField(),
      maxAssets: new NumberField({
        required: true,
        initial: 0,
        min: 0,
        step: 1,
      }),
    };
  }

  _properties = ["apperance", "maxAssets"];
}
