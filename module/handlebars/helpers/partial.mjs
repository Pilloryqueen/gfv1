// meant to work like {{> }}
// and is entirely a concession to the above syntax
// messing with prettier

import { preloadedTemplates } from "../preload.mjs";

export default function partial(key, other) {
  const template = preloadedTemplates[key];
  if (!template)
    throw new Error(
      `Template must be one of:\n * ${Object.keys(preloadedTemplates).join(
        "\n * "
      )}\n not ${key}`
    );
  const context = {};
  foundry.utils.mergeObject(context, other.data.root);
  foundry.utils.mergeObject(context, other.hash);
  return new Handlebars.SafeString(template(context));
}
