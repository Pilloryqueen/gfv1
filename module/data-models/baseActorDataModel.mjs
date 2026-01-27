import ItemList from "../sheets/elements/itemList.mjs";
import { ImportError } from "../util/error.mjs";
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
    if (items.some(this.invalidType.bind(this))) {
      throw new ImportError(
        items,
        `has a type not allowed on ${this.parent.type}`,
        this.invalidType.bind(this),
      );
    }
    if (items.some(this.invalidPlaybook.bind(this))) {
      throw new ImportError(
        items,
        `belongs in a playbook ${this.parent.type} does not support`,
        this.invalidPlaybook.bind(this),
      );
    }

    return this.parent.createEmbeddedDocuments("Item", items);
  }

  allowedItemTypes = [];
  allowedPlaybookTypes = [];

  invalidType(item) {
    return !this.allowedItemTypes.includes(item.type);
  }

  invalidPlaybook(item) {
    if (!item.system.playbookType) return false;
    return !this.allowedPlaybookTypes.includes(item.system.playbookType);
  }

  canImport(item) {
    return !this.invalidType(item) && !this.invalidPlaybook(item);
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
