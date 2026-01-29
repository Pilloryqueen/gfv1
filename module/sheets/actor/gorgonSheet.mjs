import Tabs from "../../util/tabs.mjs";
import Gfv1ActorSheet from "../actorSheet.mjs";

const TABS = ["description", "actor", "gorgon"];

export default class GorgonSheet extends Gfv1ActorSheet {
  static TABS = TABS;
  tabs = new Tabs(TABS, "primary");
}
