import ItemList from "../sheets/elements/itemList.mjs";
import DialogHelper from "../util/dialogHelper.mjs";
import AssetDataModel from "./items/assetDataModel.mjs";
import BondDataModel from "./items/bondDataModel.mjs";
import IdentityDataModel from "./items/identityDataModel.mjs";
import TagDataModel from "./items/tagDataModel.mjs";

const TypeDataModel = foundry.abstract.TypeDataModel;

export default class BaseActorDataModel extends TypeDataModel {
  async prepareContext(context) {
    context.actor = this.parent;
    context.system = this;

    const items = this.parent.itemTypes;
    context.assets = new ItemList(AssetDataModel, items.asset);
    context.identities = new ItemList(IdentityDataModel, items.identity);
    context.tags = new ItemList(TagDataModel, items.tag);
    context.bonds = new ItemList(BondDataModel, items.bond);
  }

  async addItems(items) {
    if (!Array.isArray(items)) {
      console.warn("addItems should be called with an array. Got:", items);
      items = [items];
    }
    if (items.some((item) => !this.allowedPlaybook(item))) {
      throw new Error(
        `Cannot import ${items.map((i) => i.name)} into ${
          this.parent.type
        }, allowed playbooks: ${this.allowedPlaybookTypes}`
      );
    }
    return this.parent.createEmbeddedDocuments("Item", items);
  }

  allowedPlaybookTypes = [];
  allowedPlaybook(item, strict = false) {
    if (item.system.playbookType === undefined) return !strict;
    return this.allowedPlaybookTypes.includes(item.system.playbookType);
  }

  async importPlaybook(item) {
    if (!item.type === "playbook") {
      throw new Error(`Expected playbook got ${item.type}`);
    }
    if (!this.allowedPlaybook(item, true)) {
      throw new Error(
        `Cannot import ${item.system.playbookType} into ${this.parent.type}, allowed playbooks: ${this.allowedPlaybookTypes}`
      );
    }
    const itemTypes = await item.system.getItemTypes();
    await this.importItems("assets", itemTypes.asset);
    await this.importItems(
      "bonds",
      itemTypes.bond,
      (b) => b.system.level !== "npc"
    );
    await this.importItems("identities", itemTypes.identity, () => true);
    await this.importItems("rules", itemTypes.rule, (r) => !r.system.locked);

    const system = {};
    system[`_${item.system.playbookType}`] = item.name;
    return this.parent.update({ system });
  }

  async importItems(type, items, preSelect = () => false) {
    if (items.length === 0) return;
    const selected = await DialogHelper.selectImport(items, type, preSelect);
    return this.addItems(selected);
  }

  /**
   * Roll with a known modifier
   * @param {Number} heat
   * @param {Number} mod
   */
  async roll(mod, heat = 0) {
    const roll_options = { heat, mod };
    const roll = new Roll("@heat+2d6+@mod", roll_options);
    await roll.roll();
    let flavor = "invalid total";
    if (roll.total < 8) {
      flavor = "GFv1.roll.low";
    } else if (roll.total > 10) {
      flavor = "GFv1.roll.high";
    } else {
      flavor = "GFv1.roll.med";
    }
    roll.toMessage({
      flavor: game.i18n.localize(flavor),
      speaker: { actor: this.id },
    });
  }
}
