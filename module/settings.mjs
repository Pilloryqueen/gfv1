export default function registerSettings() {
  game.settings.register("gfv1", "showItemImages", {
    name: "GFv1.settings.showItemImages.name",
    hint: "GFv1.settings.showItemImages.hint",
    scope: "client",
    config: true,
    type: Boolean,
    default: false,
  });

  game.settings.register("gfv1", "migratedVersion", {
    name: "Last successfully migrated version",
    scope: "world",
    config: false,
    type: String,
    default: "0.0.0",
  });

  game.settings.register("gfv1", "observerEdit", {
    name: "GFv1.settings.observerEdit.name",
    hint: "GFv1.settings.observerEdit.hint",
    scope: "world",
    config: true,
    type: String,
    choices: {
      allow: "GFv1.settings.observerEdit.allow",
      deny: "GFv1.settings.observerEdit.deny",
    },
    default: "deny",
  });
}
