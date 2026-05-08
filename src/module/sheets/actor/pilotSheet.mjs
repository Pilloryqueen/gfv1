import DialogHelper from "../../util/dialogHelper.mjs";
import DocumentHelper from "../../util/documentHelper.mjs";
import Tabs from "../../util/tabs.mjs";
import Gfv1ActorSheet from "../actorSheet.mjs";

const TABS = ["description", "actor", "pilot", "frame"];

export default class PilotSheet extends Gfv1ActorSheet {
  static TABS = TABS;
  tabs = new Tabs(TABS, "primary");
}
