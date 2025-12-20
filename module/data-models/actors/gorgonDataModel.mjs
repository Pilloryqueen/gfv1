import BaseActorDataModel from "../baseActorDataModel.mjs";
import { Playbook } from "../../sheets/elements/playbook.mjs";

const { HTMLField, StringField } = foundry.data.fields;

const schema = {
  bio: new HTMLField(),
  notes: new HTMLField(),
  _gorgonType: new StringField({ required: true, initial: "No Playbook" }),
};

export default class GorgonDataModel extends BaseActorDataModel {
  static defineSchema() {
    return schema;
  }

  allowedPlaybookTypes = ["gorgonType"];

  get gorgonType() {
    const playbook = new Playbook(this.parent, "gorgonType", {
      rules: "rule",
      assets: "asset",
    });
    return playbook;
  }

  get gorgonClass() {
    if (this.parent.itemTypes.gorgonClass)
      return this.parent.itemTypes.gorgonClass[0];
  }

  async setClass(item) {
    for (const oldClass of this.parent.itemTypes.gorgonClass) {
      await oldClass.delete();
    }
    return super.addItems([item]);
  }
}
