import BaseActorDataModel from "../baseActorDataModel.mjs";
import Playbook from "../../sheets/elements/playbook.mjs";

const { HTMLField, StringField, NumberField } = foundry.data.fields;

const schema = {
  description: new HTMLField(),
  pronouns: new StringField({ required: true, initial: "she/her" }),
  permissions: new NumberField({ required: true, min: 0, initial: 0, step: 1 }),
  _handlerPlaybook: new StringField({ required: true, initial: "No Playbook" }),
};

export default class HandlerDataModel extends BaseActorDataModel {
  static defineSchema() {
    return schema;
  }

  allowedPlaybookTypes = ["handlerPlaybook"];
  allowedItemTypes = ["tag", "identity", "bond", "rule", "asset", "strain"];

  get handlerPlaybook() {
    return new Playbook(this.parent, "handlerPlaybook");
  }
}
