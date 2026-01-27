import BaseActorDataModel from "../baseActorDataModel.mjs";
import Playbook from "../../sheets/elements/playbook.mjs";
import GorgonClass from "../../sheets/elements/gorgonClass.mjs";

const { HTMLField, StringField } = foundry.data.fields;

const schema = {
  description: new HTMLField(),
  _gorgonType: new StringField({ required: true, initial: "No Playbook" }),
};

export default class GorgonDataModel extends BaseActorDataModel {
  static defineSchema() {
    return schema;
  }

  async prepareContext(context) {
    await super.prepareContext(context);
    const gorgonClass = this.gorgonClass;
    if (gorgonClass) {
      context.gorgonClass = gorgonClass;
      context.maxAssets = gorgonClass.system.maxAssets;
    }
  }

  allowedPlaybookTypes = ["gorgonType"];
  allowedItemTypes = ["rule", "asset", "gorgonClass"];

  get gorgonType() {
    return new Playbook(this.parent, "gorgonType");
  }

  get gorgonClass() {
    if (this.parent.itemTypes.gorgonClass.length > 0)
      return new GorgonClass(this.parent.itemTypes.gorgonClass[0]);
  }

  async setClass(item) {
    for (const oldClass of this.parent.itemTypes.gorgonClass) {
      await oldClass.delete();
    }
    return super.addItems([item]);
  }
}
