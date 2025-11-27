const { HTMLField, BooleanField } = foundry.data.fields;

const TypeDataModel = foundry.abstract.TypeDataModel;

const schema = {
  marked: new BooleanField({ required: true, initial: false }),
  description: new HTMLField(),
};

export class TagDataModel extends TypeDataModel {
  static defineSchema() {
    return schema;
  }
}
