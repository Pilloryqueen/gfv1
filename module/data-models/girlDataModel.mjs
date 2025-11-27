import { DialogHelper } from "../util/dialogHelper.mjs";
import BaseActorDataModel, { Playbook } from "./baseActorDataModel.mjs";

const { BooleanField, HTMLField, NumberField, SchemaField, StringField } =
  foundry.data.fields;

const schema = {
  bio: new HTMLField(),
  notes: new HTMLField(),
  permissions: new NumberField({ required: true, min: 0, initial: 0, step: 1 }),
  heat: new NumberField({ required: true, min: 0, initial: 0, step: 1 }),
  pronouns: new StringField({ required: true, initial: "it/its" }),
  test: new BooleanField({ initial: true }),
  _framePlaybook: new StringField({ required: true, initial: "No Playbook" }),
  _girlPlaybook: new StringField({ required: true, initial: "No Playbook" }),
};

export class GirlDataModel extends BaseActorDataModel {
  static defineSchema() {
    return schema;
  }

  allowedPlaybookTypes = ["girlPlaybook", "framePlaybook"];

  get girlPlaybook() {
    const playbook = new Playbook(this.parent, "girlPlaybook", {
      rules: "rule",
      assets: "asset",
    });
    playbook.maxAssets = CONFIG.GFV1.maxAssets.girl;
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
    if (item.parent === this) {
      throw new Error(
        `${this.name} (id: ${this.id}) is not parent of ${item} (parent.id: ${item.parent.id})`
      );
    }
    item.update({ type: "identity", system: { marked: "false" } });
  }

  /**
   * Spend heat
   * @param {Number} amount
   * @returns true if successful
   */
  async spendHeat(amount) {
    const doc = this.parent;
    const newHeat = doc.system.heat - amount;
    if (newHeat < 0 || amount < 0) return false;
    doc.update({ "system.heat": newHeat });
    return true;
  }

  async spendHeatAndRoll(mod, heat) {
    (await this.spendHeat(heat)) && this.roll(mod, heat);
  }

  async roll_from_sheet() {
    const heat = await DialogHelper.rollHeatQuery(this.parent.system.heat);
    if (heat === undefined || heat < 0) return;
    const mod = await DialogHelper.rollModifierQuery();
    if (mod === undefined) return;
    return this.spendHeatAndRoll(mod, heat);
  }
}
