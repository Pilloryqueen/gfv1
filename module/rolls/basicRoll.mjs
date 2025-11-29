export default class BasicRoll extends Roll {
  constructor({ heat = 0, mod = 0, item }) {
    super("@heat+2d6+@mod", { heat, mod });
    this.heat = heat;
    this.mod = mod;
    this.item = item;
  }

  get resultType() {
    if (!this._evaluated) return;
    if (this.total < 8) return "low";
    if (this.total > 10) return "high";
    return "med";
  }

  get resultHeader() {
    return game.i18n.localize(`GFv1.item.rule.${this.resultType}`);
  }

  get resultDescription() {
    if (!this._evaluated) return;
    if (this.item) {
      return this.item.system[this.resultType];
    } else {
      return game.i18n.localize(`GFv1.roll.${this.resultType}`);
    }
  }

  get itemDescription() {
    if (!this.item) return;
    return this.item.system.description;
  }

  async toMessage(actor) {
    if (!this._evaluated) await this.evaluate();

    const chatData = {
      speaker: ChatMessage.getSpeaker({ actor }),
      content: await renderTemplate(
        "systems/gfv1/templates/rolls/roll.hbs",
        this
      ),
      roll: this,
    };

    return getDocumentClass("ChatMessage").create(chatData);
  }
}
