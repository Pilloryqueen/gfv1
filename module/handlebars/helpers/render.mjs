// item.render() should return an html element
// the main motivation for using this over Handlebars partials
// is that {{> }} partial rendering makes prettier unable to format the file

import Gfv1Error from "../../util/error.mjs";

// which is very unfortunate
export default function render(item, other) {
  if (item === undefined) throw new Gfv1Error("Tried to render undefined!");
  if (typeof item.render !== "function")
    throw new Gfv1Error(`render is not a function, but ${typeof item.render}`);
  const context = {};
  foundry.utils.mergeObject(context, other.data.root);
  foundry.utils.mergeObject(context, other.hash);
  return new Handlebars.SafeString(item.render(context));
}
