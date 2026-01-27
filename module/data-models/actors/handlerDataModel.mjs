import BaseActorDataModel from "../baseActorDataModel.mjs";
import Playbook from "../../sheets/elements/playbook.mjs";

const { HTMLField, StringField } = foundry.data.fields;

const schema = {
  description: new HTMLField(),
  pronouns: new StringField({ required: true, initial: "she/her" }),
  _handlerPlaybook: new StringField({ required: true, initial: "No Playbook" }),
};

export default class HandlerDataModel extends BaseActorDataModel {
  static defineSchema() {
    return schema;
  }

  allowedPlaybookTypes = ["handlerPlaybook"];
  allowedItemTypes = ["tag", "identity", "bond", "rule", "asset", ];

  get handlerPlaybook() {
    return new Playbook(this.parent, "handlerPlaybook");
  }
}
