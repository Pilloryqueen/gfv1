export function registerSettings() {
  game.settings.register("gfv1", "showItemImages", {
    name: "GFv1.settings.showItemImages.name",
    hint: "GFv1.settings.showItemImages.hint",
    scope: "client",
    config: true,
    type: Boolean,
    default: false,
    requiresReload: true,
  });
}
