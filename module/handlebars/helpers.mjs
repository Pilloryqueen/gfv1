import config from "./helpers/config.mjs";
import defined from "./helpers/defined.mjs";
import render from "./helpers/render.mjs";
import settings from "./helpers/settings.mjs";

export default function registerHelpers() {
  Handlebars.registerHelper("settings", settings);
  Handlebars.registerHelper("config", config);
  Handlebars.registerHelper("defined", defined);
  Handlebars.registerHelper("render", render);
}
