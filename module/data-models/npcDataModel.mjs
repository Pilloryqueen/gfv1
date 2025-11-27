const { HTMLField } = foundry.data.fields;

const TypeDataModel = foundry.abstract.TypeDataModel;

const schema = {
  bio: new HTMLField(),
  notes: new HTMLField(),
};

export class NpcDataModel extends TypeDataModel {
  static defineSchema() {
    return schema;
  }
}
