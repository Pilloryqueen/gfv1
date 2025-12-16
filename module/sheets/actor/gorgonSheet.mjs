import Gfv1ActorSheet from "../actorSheet.mjs";

export default class GorgonSheet extends Gfv1ActorSheet {
  tabs = {
    gorgon: {
      icon: "fa-venus",
      group: "primary",
      label: "GFv1.tab.gorgon",
    },
  };

  static PARTS = {
    header: {
      template: "systems/gfv1/templates/actor/header.hbs",
    },
    tabs: {
      template: "systems/gfv1/templates/generic/tab-navigation.hbs",
    },
    basicInfo: {
      template: "systems/gfv1/templates/actor/basic-info.hbs",
    },
    // Tabs:
    gorgon: {
      template: "systems/gfv1/templates/actor/tabs/gorgon.hbs",
    },
    // Partials:
    gorgonClass: {
      template: "systems/gfv1/templates/actor/partials/gorgonClass.hbs",
    },
    playbook: {
      template: "systems/gfv1/templates/actor/partials/playbook.hbs",
    },
    rules: {
      template: "systems/gfv1/templates/actor/partials/rules-list.hbs",
    },
    assets: {
      template: "systems/gfv1/templates/actor/partials/assets-list.hbs",
    },
    identities: {
      template: "systems/gfv1/templates/actor/partials/identities-list.hbs",
    },
    tags: {
      template: "systems/gfv1/templates/actor/partials/tags-list.hbs",
    },
    bonds: {
      template: "systems/gfv1/templates/actor/partials/bonds-list.hbs",
    },
  };

  _configureRenderOptions(options) {
    super._configureRenderOptions(options);
    options.parts = ["header", "basicInfo", "tabs"];
    if (this.document.limited) {
      // Any limited view only tabs
    } else {
      options.defaultTab = "gorgon";
      options.parts.push("gorgon");
    }
  }

  async _onDropItem(item) {
    switch (item.type) {
      case "gorgonClass":
        return this.actor.system.setClass(item);
      default:
        return super._onDropItem(item);
    }
  }
}
