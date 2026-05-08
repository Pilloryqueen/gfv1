// returns a safe string to render a roll result.
import { preloadedTemplates } from "../preload.mjs";

export default function showRoll(roll, _other) {
  // TODO: Implement actual logic for generating roll timeline

  return new Handlebars.SafeString(
    preloadedTemplates.rollResult({
      d1icon: `fas fa-dice-${word(roll.d1)}`,
      d2icon: `fas fa-dice-${word(roll.d2)}`,
      ...roll,
    })
  );
}

const words = ["one", "two", "three", "four", "five", "six"];
function word(num) {
  return words[num - 1];
}
