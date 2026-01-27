import Tabs from "../../util/tabs.mjs";
import Gfv1ActorSheet from "../actorSheet.mjs";

const TABS = ["description", "actor", "handler"];

export default class HandlerSheet extends Gfv1ActorSheet {
  static TABS = TABS;
  tabs = new Tabs(TABS, "primary");
}
