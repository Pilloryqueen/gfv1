import { DialogHelper } from "../../util/dialogHelper.mjs";
import { DocumentHelper } from "../../util/documentHelper.mjs";
import Gfv1ActorSheet from "../actorSheet.mjs";

export default class PilotSheet extends Gfv1ActorSheet {
  static ACTIONS = {
    adoptTag: this._adoptTag,
  };

  tabs = {
    main: {
      icon: "fa-house",
      group: "primary",
      label: "GFv1.tab.main",
    },
    pilot: {
      icon: "fa-venus",
      group: "primary",
      label: "GFv1.tab.pilot",
    },
    frame: {
      icon: "fa-car",
      group: "primary",
      label: "GFv1.tab.frame",
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
    pilot: {
      template: "systems/gfv1/templates/actor/tabs/pilot.hbs",
    },
    frame: {
      template: "systems/gfv1/templates/actor/tabs/frame.hbs",
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
      options.parts.push("pilot");
      options.parts.push("frame");
    }
  }

  /**
   * Handle adopting a tag as an identity
   *
   * @this PilotSheet
   * @param {PointerEvent} event   The originating click event
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
   * @private
   */
  static async _adoptTag(event, target) {
    const doc = await DocumentHelper.getItemFromHTML(target, this.actor.items);
    if (event.shiftKey) return this.actor.system.adoptTag(doc);

    if (await DialogHelper.confirmAdopt()) {
      this.actor.system.adoptTag(doc);
    }
  }
}
