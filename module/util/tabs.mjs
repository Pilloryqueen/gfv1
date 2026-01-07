const icons = {
  description: "feather-pointed",
  frame: "car",
  gorgon: "venus",
  handler: "venus",
  item: "gears",
  actor: "house",
  pilot: "venus",
};

export class TabGroup {
  constructor(ids, defaultTab, group) {
    this.groupName = group;
    this.defaultTab = defaultTab;
    this.ids = ids;

    this._tabs = ids.map((id) => {
      const icon = icons[id];
      if (!icon) throw new Error(`GFV1 | ${id} is not a valid tab`);
      return new Tab(id, icon, group);
    });
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

export default class Tab {
  constructor(id, icon, group) {
    this.id = id;
    this.icon = `fa-${icon}`;
    this.group = group;
    this.label = `GFv1.tab.${id}`;
  }

  static createGroup(ids, defaultTab, group) {
    console.log("DEPRECATED use new TabGroup instead");
    const tabs = {};
    for (const id of ids) {
      const icon = icons[id];
      if (!icon) throw new Error(`GFV1 | ${id} is not a valid tab`);
      tabs[id] = new Tab(id, icon, group);
    }
    tabs[defaultTab].active = "active";
    return tabs;
  }

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
      }
    );
  }
}
