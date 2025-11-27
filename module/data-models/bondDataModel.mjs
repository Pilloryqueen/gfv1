const { HTMLField, StringField } = foundry.data.fields;

const TypeDataModel = foundry.abstract.TypeDataModel;

const schema = {
  level: new StringField({ required: true, initial: "npc" }),
  description: new HTMLField(),
};

export class BondDataModel extends TypeDataModel {
  static defineSchema() {
    return schema;
  }
}
