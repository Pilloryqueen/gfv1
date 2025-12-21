import AssetDataModel from "../../data-models/items/assetDataModel.mjs";
import RuleDataModel from "../../data-models/items/ruleDataModel.mjs";
import { preloadedTemplates } from "../../handlebars/preload.mjs";
import ItemList from "./itemList.mjs";

export default class Playbook {
  constructor(parent, type) {
    const itemTypes = {
      rules: "rule",
      assets: "asset",
    };
    this.name = parent.system[`_${type}`];
    this.playbookType = type;
    const filter = (item) => {
      return item.system.playbookType === type;
    };
    for (const k in itemTypes) {
      this[k] = parent.itemTypes[itemTypes[k]].filter(filter);
    }
  }

  render({ locked, maxAssets, editable, actor }) {
    const rules = locked
      ? this.rules.filter((item) => item.system.locked === false)
      : this.rules;
    const context = {
      rules: new ItemList(RuleDataModel, rules),
      assets: new ItemList(AssetDataModel, this.assets),
      name: this.name,
      playbookType: this.playbookType,
      locked,
      maxAssets,
      editable,
      actor,
    };
    return preloadedTemplates.playbook(context);
  }
}
