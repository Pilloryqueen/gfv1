import { TabError } from "./error.mjs";

const icons = {
  description: "feather-pointed",
  frame: "car",
  gorgon: "venus",
  handler: "venus",
  item: "gears",
  actor: "house",
  pilot: "venus",
};

export default class Tabs {
  static templates(ids) {
    return ids.reduce(
      (templates, id) => {
        templates[id] = { template: `systems/gfv1/templates/tabs/${id}.hbs` };
        return templates;
      },
      {
        tabs: {
          template: "systems/gfv1/templates/tab-navigation.hbs",
        },
      },
    );
  }

  constructor(ids, group) {
    this.groupName = group;
    this.defaultTab = ids[0];
    this.ids = ids;

    this._tabs = ids.map((id) => {
      const icon = icons[id];
      if (!icon) throw new TabError(id);
      return new Tab(id, icon, group);
    });
  }

  limitTabsTo(ids) {
    this.ids = this.ids.filter((id) => ids.includes(id));
    this._tabs = this._tabs.filter((tab) => ids.includes(tab.id));
  }

  contextData(tabGroups) {
    let activeTab = tabGroups[this.groupName];
    if (!activeTab) {
      activeTab = this.defaultTab;
    }

    return this._tabs.reduce((tabs, tab) => {
      if (tab.id === activeTab) {
        tabs[tab.id] = { active: "active", ...tab };
      } else {
        tabs[tab.id] = tab;
      }
      return tabs;
    }, {});
  }
}

class Tab {
  constructor(id, icon, group) {
    this.id = id;
    this.icon = `fa-${icon}`;
    this.group = group;
    this.label = `GFv1.tab.${id}`;
  }
}
