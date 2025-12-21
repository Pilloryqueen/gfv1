import { preloadedTemplates } from "../../handlebars/preload.mjs";

export default class GorgonClass {
  constructor(item) {
    this.item = item;
    this.system = item.system;
  }

  render(outerContext) {
    return preloadedTemplates.gorgonClass({
      ...outerContext,
      item: this.item,
      system: this.system,
    });
  }
}
