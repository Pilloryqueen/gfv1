import Tab from "../../util/tabs.mjs";
import Gfv1ActorSheet from "../actorSheet.mjs";

const TABS = ["description", "gorgon"];

export default class GorgonSheet extends Gfv1ActorSheet {
  static TABS = TABS;
  tabs = Tab.createGroup(TABS, "actor", "primary");

  async _onDropItem(item) {
    switch (item.type) {
      case "gorgonClass":
        return this.actor.system.setClass(item);
      default:
        return super._onDropItem(item);
    }
  }
}
