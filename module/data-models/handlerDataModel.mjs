import BaseActorDataModel, { Playbook } from "./baseActorDataModel.mjs";

const { HTMLField, StringField } = foundry.data.fields;

const TypeDataModel = foundry.abstract.TypeDataModel;

const schema = {
  bio: new HTMLField(),
  notes: new HTMLField(),
  pronouns: new StringField({ required: true, initial: "she/her" }),
  _handlerPlaybook: new StringField({ required: true, initial: "No Playbook" }),
};

export class HandlerDataModel extends BaseActorDataModel {
  static defineSchema() {
    return schema;
  }

  allowedPlaybookTypes = ["handlerPlaybook"];

  get handlerPlaybook() {
    const playbook = new Playbook(this.parent, "handlerPlaybook", {
      rules: "rule",
      assets: "asset",
    });
    return playbook;
  }
}
