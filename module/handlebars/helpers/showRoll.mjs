// returns a safe string to render a roll result.
import { preloadedTemplates } from "../preload.mjs";

export default function showRoll(roll, _other) {
  console.log(roll);
  return new Handlebars.SafeString(preloadedTemplates.rollResult({}));
}
