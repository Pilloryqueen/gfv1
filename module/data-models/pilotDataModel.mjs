import BaseActorDataModel from "./baseActorDataModel.mjs";
import { Playbook } from "./playbookDataModel.mjs";

const { BooleanField, HTMLField, NumberField, StringField } =
  foundry.data.fields;

const schema = {
  bio: new HTMLField(),
  notes: new HTMLField(),
  permissions: new NumberField({ required: true, min: 0, initial: 0, step: 1 }),
  heat: new NumberField({ required: true, min: 0, initial: 0, step: 1 }),
  pronouns: new StringField({ required: true, initial: "it/its" }),
  test: new BooleanField({ initial: true }),
  _framePlaybook: new StringField({ required: true, initial: "No Playbook" }),
  _pilotPlaybook: new StringField({ required: true, initial: "No Playbook" }),
};

export class PilotDataModel extends BaseActorDataModel {
  static defineSchema() {
    return schema;
  }

  allowedPlaybookTypes = ["pilotPlaybook", "framePlaybook"];

  get pilotPlaybook() {
    const playbook = new Playbook(this.parent, "pilotPlaybook", {
      rules: "rule",
      assets: "asset",
    });
    playbook.maxAssets = CONFIG.GFV1.maxAssets.pilot;
    return playbook;
  }

  get framePlaybook() {
    const playbook = new Playbook(this.parent, "framePlaybook", {
      rules: "rule",
      assets: "asset",
    });
    playbook.maxAssets = CONFIG.GFV1.maxAssets.frame;
    return playbook;
  }

  async adoptTag(item) {
    if (item.parent !== this.parent) {
      throw new Error(
        `${this.name} (id: ${this.id}) is not parent of ${item.id} (parent.id: ${item.parent?.id})`
      );
    }
    item.update({ type: "identity", system: { marked: "false" } });
  }

  async spendHeat(amount) {
    if (amount < 0) throw Error("Cannot spend negative heat!");
    const doc = this.parent;
    const newHeat = doc.system.heat - amount;
    if (newHeat < 0) throw Error("Spent too much heat!");
    return doc.update({ "system.heat": newHeat });
  }
}
