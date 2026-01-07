import DialogHelper from "../../util/dialogHelper.mjs";
import DocumentHelper from "../../util/documentHelper.mjs";
import { TabGroup } from "../../util/tabs.mjs";
import Gfv1ActorSheet from "../actorSheet.mjs";

const TABS = ["description", "actor", "pilot", "frame"];

export default class PilotSheet extends Gfv1ActorSheet {
  static TABS = TABS;
  tabs = new TabGroup(TABS, "actor", "primary");

  static ACTIONS = {
    embraceTag: this._embraceTag,
  };

  /**
   * Handle embracing a tag as an identity
   *
   * @this PilotSheet
   * @param {PointerEvent} event   The originating click event
   * @param {HTMLElement} target   The capturing HTML element which defined a [data-action]
   * @private
   */
  static async _embraceTag(event, target) {
    const doc = await DocumentHelper.getItemFromHTML(target, this.actor.items);
    if (event.shiftKey) return this.actor.system.embraceTag(doc);

    if (await DialogHelper.confirmAdopt()) {
      this.actor.system.embraceTag(doc);
    }
  }
}
