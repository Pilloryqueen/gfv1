import { GirlDataModel } from "./module/data-models/girlDataModel.mjs";
import { HandlerDataModel } from "./module/data-models/handlerDataModel.mjs";
import { NpcDataModel } from "./module/data-models/npcDataModel.mjs";
import {
  GirlPlaybookDataModel,
  FramePlaybookDataModel,
  PlaybookDataModel,
} from "./module/data-models/playbookDataModel.mjs";
import { TagDataModel } from "./module/data-models/tagDataModel.mjs";
import { BondDataModel } from "./module/data-models/bondDataModel.mjs";
import { IdentityDataModel } from "./module/data-models/identityDataModel.mjs";
import Gfv1Actor from "./module/documents/gfv1Actor.mjs";
import Gfv1Item from "./module/documents/gfv1Item.mjs";
import { GFV1 } from "./module/config.mjs";
import Gfv1ItemSheet from "./module/sheets/itemSheet.mjs";
import { AssetDataModel } from "./module/data-models/assetDataModel.mjs";
import { RuleDataModel } from "./module/data-models/ruleDataModel.mjs";
import { registerSettings } from "./module/settings.mjs";
import GirlSheet from "./module/sheets/actor/girlSheet.mjs";
import HandlerSheet from "./module/sheets/actor/handlerSheet.mjs";

Hooks.once("init", async () => {
  console.log("GFV1 | Initializing Girlframe System");
  CONFIG.GFV1 = GFV1;

  registerSettings();

  CONFIG.Actor.DocumentClass = Gfv1Actor;
  CONFIG.Actor.dataModels.girl = GirlDataModel;
  CONFIG.Actor.dataModels.npc = NpcDataModel;
  CONFIG.Actor.dataModels.handler = HandlerDataModel;

  CONFIG.Item.DocumentClass = Gfv1Item;
  CONFIG.Item.dataModels.asset = AssetDataModel;
  CONFIG.Item.dataModels.bond = BondDataModel;
  CONFIG.Item.dataModels.playbook = PlaybookDataModel;
  CONFIG.Item.dataModels.framePlaybook = FramePlaybookDataModel;
  CONFIG.Item.dataModels.girlPlaybook = GirlPlaybookDataModel;
  CONFIG.Item.dataModels.identity = IdentityDataModel;
  CONFIG.Item.dataModels.rule = RuleDataModel;
  CONFIG.Item.dataModels.tag = TagDataModel;

  registerSheets();
  registerHelpers();

  console.log("GFV1 | System Init Completed");
});

function registerSheets() {
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("gfv1", GirlSheet, {
    makeDefault: true,
    types: ["girl"],
    label: "GFV1.sheets.girlSheet",
  });
  Actors.registerSheet("gfv1", HandlerSheet, {
    makeDefault: true,
    types: ["handler"],
    label: "GFV1.sheets.handlerSheet",
  });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("gfv1", Gfv1ItemSheet, {
    makeDefault: true,
    label: "GFV1.sheets.itemSheet",
  });
}

function registerHelpers() {
  Handlebars.registerHelper("list", function (...a) {
    a.pop();
    return a;
  });

  Handlebars.registerHelper(
    "settings",
    function (namespace, key, { document }) {
      return game.settings.get(namespace, key);
    }
  );

  Handlebars.registerHelper("config", function (key) {
    return CONFIG.GFV1[key];
  });

  Handlebars.registerHelper("showif", function (expr, value) {
    if (expr) return value;
  });
}
