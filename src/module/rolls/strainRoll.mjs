export default class StrainRoll extends Roll {
  constructor({ item }) {
    super("1d@sides", { sides: item.system.options });
    this.item = item;
  }

  async toMessage(actor) {
    if (!this._evaluated) await this.evaluate();
    const description = await this.item.enrichedDescription(false);
    const outcome = await this.item.system.getOutcome(this.total);
    const chatData = {
      speaker: ChatMessage.getSpeaker({ actor }),
      sound: CONFIG.sounds.dice,
      content: await renderTemplate("systems/gfv1/templates/chat/strain-roll.hbs", {
        roll: {
          total: this.total,
        },
        item: this.item,
        description,
        outcome,
      }),
      roll: this,
    };

    if (this.item.system.secret) {
      chatData.whisper = [game.user.id];
    }

    return ChatMessage.create(chatData);
  }
}
