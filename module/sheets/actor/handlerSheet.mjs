import Gfv1ActorSheet from "../actorSheet.mjs";

export default class HandlerSheet extends Gfv1ActorSheet {
  static ACTIONS = {};

  tabs = {
    main: {
      icon: "fa-house",
      group: "primary",
      label: "GFv1.tab.main",
    },
    handler: {
      icon: "fa-venus",
      group: "primary",
      label: "GFv1.tab.handler",
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
    main: {
      template: "systems/gfv1/templates/actor/tabs/main.hbs",
    },
    handler: {
      template: "systems/gfv1/templates/actor/tabs/handler.hbs",
    },
    // Partials:
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
      options.defaultTab = "main";
      options.parts.push("main");
      options.parts.push("handler");
    }
  }

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    return context;
  }
}
