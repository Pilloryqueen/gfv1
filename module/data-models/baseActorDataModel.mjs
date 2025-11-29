import { DialogHelper } from "../util/dialogHelper.mjs";

const TypeDataModel = foundry.abstract.TypeDataModel;

export class Playbook {
  constructor(parent, type, itemTypes) {
    this.name = parent.system[`_${type}`];
    this.playbookType = type;
    const filter = (item) => {
      return item.system.playbookType === type;
    };
    for (const k in itemTypes) {
      this[k] = parent.itemTypes[itemTypes[k]].filter(filter);
    }
  }
}

export default class BaseActorDataModel extends TypeDataModel {
  addItems(items) {
    this.parent.createEmbeddedDocuments("Item", items);
  }

  async createAssets(names, playbook) {
    if (names.length === 0) return;
    const selectedNames = await DialogHelper.selectImport(names, "assets");
    return Promise.all(
      selectedNames.map((name) => {
        return Item.create(
          {
            name,
            type: "asset",
            "system.playbookType": playbook.system.playbookType,
          },
          { parent: this.parent }
        );
      })
    );
  }

  async createBonds(names) {
    if (names.length === 0) return;
    const selectedNames = await DialogHelper.selectImport(names, "bonds");
    return Promise.all(
      selectedNames.map((name) => {
        return Item.create({ name, type: "bond" }, { parent: this.parent });
      })
    );
  }

  allowedPlaybookTypes = [];
  async importPlaybook(item) {
    if (!item.type === "playbook") {
      throw new Error(`Expected playbook got ${item.type}`);
    }
    if (!this.allowedPlaybookTypes.includes(item.system.playbookType)) {
      throw new Error(
        `Cannot import ${item.system.playbookType} into ${this.parent.type}, allowed playbooks: ${this.allowedPlaybookTypes}`
      );
    }
    await this.createAssets(item.system.assets, item);

    if (item.system.bonds) await this.createBonds(item.system.bonds);
    this.addItems(item.system.rules);
    const system = {};
    system[`_${item.system.playbookType}`] = item.name;
    return this.parent.update({ system });
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
