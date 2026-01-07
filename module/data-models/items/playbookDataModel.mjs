import BaseItemDataModel from "../baseItemDataModel.mjs";
import DialogHelper from "../../util/dialogHelper.mjs";
import fromUuid from "../../util/uuid.mjs";
import PlaybookTypeField from "../fields/playbookTypeField.mjs";
import RuleDataModel, { AdvancementDataModel } from "./ruleDataModel.mjs";
import ItemList from "../../sheets/elements/itemList.mjs";
import BondDataModel from "./bondDataModel.mjs";
import AssetDataModel from "./assetDataModel.mjs";
import IdentityDataModel from "./identityDataModel.mjs";

const { HTMLField, ArrayField, DocumentUUIDField } = foundry.data.fields;

export default class PlaybookDataModel extends BaseItemDataModel {
  static type = "playbook";
  static defineSchema() {
    return {
      description: new HTMLField(),
      playbookType: new PlaybookTypeField({
        required: true,
      }),
      items: new ArrayField(new DocumentUUIDField({ required: true }), {
        required: true,
        initial: [],
      }),
    };
  }

  async prepareContext(context) {
    await super.prepareContext(context);
    context.items = await this.getItems();
    const itemTypes = await this.getItemTypes();
    const rules = [];
    const advancements = [];
    for (const rule of itemTypes.rule) {
      if (rule.system.locked) {
        advancements.push(rule);
      } else {
        rules.push(rule);
      }
    }

    context.rules = new ItemList(RuleDataModel, rules);
    context.advancements = new ItemList(AdvancementDataModel, advancements);
    context.assets = new ItemList(AssetDataModel, itemTypes.asset);
    context.bonds = new ItemList(BondDataModel, itemTypes.bond);
    context.identities = new ItemList(IdentityDataModel, itemTypes.identity);
  }

  async getItemTypes() {
    const items = await this.getItems();
    const itemTypes = {
      rule: [],
      asset: [],
      bond: [],
      identity: [],
    };
    for (const i of items) {
      itemTypes[i.type].push(i);
    }
    return itemTypes;
  }

  async getItems() {
    return await Promise.all(this.items.map((uuid) => fromUuid(uuid)));
  }

  async addRef(uuid) {
    const item = await fromUuid(uuid);
    if (!["rule", "asset", "bond", "identity"].includes(item.type))
      throw new Error(`Playbook doesn't currently support importing ${item.type}`);
    if (
      item.system.playbookType !== undefined &&
      item.system.playbookType !== this.playbookType
    ) {
      await DialogHelper.warn_playbook_import(item, this.parent);
    }
    const items = this.items;
    items.push(uuid);
    return this.parent.update({ system: { items } });
  }

  async deleteRef(uuid) {
    const index = this.items.indexOf(uuid);
    if (index === -1)
      throw new Error(`Cannot delete ${uuid} from playbook. Not Found`);
    const items = this.items;
    items.splice(index, 1);
    return this.parent.update({ system: { items } });
  }
}
