class ItemControl {
  constructor({ dataset, cssClass = "", icon, shouldRender = (_) => true }) {
    this.cssClass = cssClass;
    this.icon = icon;
    this.dataset = (context) =>
      Object.entries(dataset(context))
        .map(([k, v]) => `data-${k}="${v}"`)
        .join("\n");
    this.shouldRender = shouldRender;
  }

  render(context) {
    if (!this.shouldRender(context)) return "";
    return `<a
class="item-control ${this.cssClass}"
${this.dataset(context)}
>
  <i class="fas ${this.icon}"></i>
</a>`;
  }
}

export const createDoc = new ItemControl({
  cssClass: "item-create",
  icon: "fa-plus",
  dataset: ({ type, playbookType }) => {
    return {
      action: "createDoc",
      type,
      name: `new ${type}`,
      tooltip: game.i18n.format("DOCUMENT.New", { type }),
      "system.playbook-type": playbookType,
    };
  },
  shouldRender: ({ editable }) => editable,
});

export const viewDoc = new ItemControl({
  cssClass: "item-edit",
  icon: "fa-edit",
  dataset: ({ type }) => {
    return {
      action: "viewDoc",
      tooltip: game.i18n.localize(`GFv1.item.${type}.edit`),
    };
  },
});

export const deleteDoc = new ItemControl({
  cssClass: "item-delete",
  icon: "fa-trash",
  dataset: ({ type }) => {
    return {
      action: "deleteDoc",
      tooltip: game.i18n.localize(`GFv1.item.${type}.delete`),
    };
  },
  shouldRender: ({ locked, editable }) => editable && !locked,
});

export const embraceTag = new ItemControl({
  cssClass: "item-embrace-tag",
  icon: "fa-star",
  dataset: (_) => {
    return {
      action: "embraceTag",
      tooltip: game.i18n.localize("GFv1.item.tag.embrace"),
    };
  },
  shouldRender: ({ type, editable }) => type === "tag" && editable,
});

export const makeRoll = new ItemControl({
  cssClass: "item-roll",
  icon: "fa-dice",
  dataset: (_) => {
    return {
      action: "makeRoll",
      tooltip: game.i18n.localize("GFv1.item.rule.roll"),
    };
  },
  shouldRender: ({ item, actor }) => item.system.play && actor,
});
