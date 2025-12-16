import GorgonDataModel from "./module/data-models/actors/gorgonDataModel.mjs";
import HandlerDataModel from "./module/data-models/actors/handlerDataModel.mjs";
import PilotDataModel from "./module/data-models/actors/pilotDataModel.mjs";
import AssetDataModel from "./module/data-models/items/assetDataModel.mjs";
import BondDataModel from "./module/data-models/items/bondDataModel.mjs";
import GorgonClassDataModel from "./module/data-models/items/gorgonClassDataModel.mjs";
import IdentityDataModel from "./module/data-models/items/identityDataModel.mjs";
import PlaybookDataModel from "./module/data-models/items/playbookDataModel.mjs";
import RuleDataModel from "./module/data-models/items/ruleDataModel.mjs";
import TagDataModel from "./module/data-models/items/tagDataModel.mjs";
import Gfv1Actor from "./module/documents/gfv1Actor.mjs";
import Gfv1Item from "./module/documents/gfv1Item.mjs";
import PilotSheet from "./module/sheets/actor/pilotSheet.mjs";
import HandlerSheet from "./module/sheets/actor/handlerSheet.mjs";
import GorgonSheet from "./module/sheets/actor/gorgonSheet.mjs";
import Gfv1ItemSheet from "./module/sheets/itemSheet.mjs";
import { GFV1 } from "./module/config.mjs";
import registerSettings from "./module/settings.mjs";
import migrateWorld from "./module/migration.mjs";

Hooks.once("init", async () => {
  console.log("GFV1 | Initializing Girlframe System");
  CONFIG.GFV1 = GFV1;

  registerSettings();

  CONFIG.Actor.DocumentClass = Gfv1Actor;
  CONFIG.Actor.dataModels.gorgon = GorgonDataModel;
  CONFIG.Actor.dataModels.handler = HandlerDataModel;
  CONFIG.Actor.dataModels.pilot = PilotDataModel;

  CONFIG.Item.DocumentClass = Gfv1Item;
  CONFIG.Item.dataModels.asset = AssetDataModel;
  CONFIG.Item.dataModels.bond = BondDataModel;
  CONFIG.Item.dataModels.gorgonClass = GorgonClassDataModel;
  CONFIG.Item.dataModels.identity = IdentityDataModel;
  CONFIG.Item.dataModels.playbook = PlaybookDataModel;
  CONFIG.Item.dataModels.rule = RuleDataModel;
  CONFIG.Item.dataModels.tag = TagDataModel;

  registerSheets();
  registerHelpers();

  console.log("GFV1 | System Init Completed");
});

Hooks.once("ready", () => {
  if (game.user.isGM) {
    checkMigratons();
  }
});

async function checkMigratons() {
  const previousVersion = game.settings.get("gfv1", "migratedVersion");
  const currentVersion = game.system.version;

  if (currentVersion !== previousVersion) {
    await migrateWorld(previousVersion);
    game.settings.set("gfv1", "migratedVersion", currentVersion);
  }
}

function registerSheets() {
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("gfv1", PilotSheet, {
    makeDefault: true,
    types: ["pilot"],
    label: "GFV1.sheets.pilotSheet",
  });
  Actors.registerSheet("gfv1", HandlerSheet, {
    makeDefault: true,
    types: ["handler"],
    label: "GFV1.sheets.handlerSheet",
  });
  Actors.registerSheet("gfv1", GorgonSheet, {
    makeDefault: true,
    types: ["gorgon"],
    label: "GFV1.sheets.gorgonSheet",
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

  Handlebars.registerHelper("settings", function (namespace, key) {
    return game.settings.get(namespace, key);
  });

  Handlebars.registerHelper("config", function (key) {
    return CONFIG.GFV1[key];
  });

  Handlebars.registerHelper("defined", function (val) {
    return val !== undefined && val !== null;
  });

  Handlebars.registerHelper("define", function (name, val) {
    this[name] = val;
  });
}
