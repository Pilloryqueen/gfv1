import StrainRoll from "../../rolls/strainRoll.mjs";
import DocumentHelper from "../../util/documentHelper.mjs";
import Tabs from "../../util/tabs.mjs";
import Gfv1ActorSheet from "../actorSheet.mjs";

const TABS = ["description", "actor", "handler", "strain"];

export default class HandlerSheet extends Gfv1ActorSheet {
  static TABS = TABS;
  tabs = new Tabs(TABS, "primary");

  static ACTIONS = {
    rollStrain: this._rollStrain,
  };

  static async _rollStrain(event, target) {
    const item = await DocumentHelper.getItemFromHtml(target);
    const roll = new StrainRoll({ item });
    return roll.toMessage(this.actor);
  }
}
