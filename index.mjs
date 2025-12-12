import { PilotDataModel } from "./module/data-models/pilotDataModel.mjs";
import { HandlerDataModel } from "./module/data-models/handlerDataModel.mjs";
import { PlaybookDataModel } from "./module/data-models/playbookDataModel.mjs";
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
import PilotSheet from "./module/sheets/actor/pilotSheet.mjs";
import HandlerSheet from "./module/sheets/actor/handlerSheet.mjs";
import { GorgonDataModel } from "./module/data-models/gorgonDataModel.mjs";

Hooks.once("init", async () => {
  console.log("GFV1 | Initializing Girlframe System");
  CONFIG.GFV1 = GFV1;

  registerSettings();

  CONFIG.Actor.DocumentClass = Gfv1Actor;
  CONFIG.Actor.dataModels.pilot = PilotDataModel;
  CONFIG.Actor.dataModels.gorgon = GorgonDataModel;
  CONFIG.Actor.dataModels.handler = HandlerDataModel;

  CONFIG.Item.DocumentClass = Gfv1Item;
  CONFIG.Item.dataModels.asset = AssetDataModel;
  CONFIG.Item.dataModels.bond = BondDataModel;
  CONFIG.Item.dataModels.playbook = PlaybookDataModel;
  CONFIG.Item.dataModels.identity = IdentityDataModel;
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
}
