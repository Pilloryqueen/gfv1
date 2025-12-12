import BaseActorDataModel from "./baseActorDataModel.mjs";

const { HTMLField } = foundry.data.fields;

const schema = {
  bio: new HTMLField(),
  notes: new HTMLField(),
};

export class GorgonDataModel extends BaseActorDataModel {
  static defineSchema() {
    return schema;
  }
}
