export default class Gfv1Actor extends Actor {
  async enrichedDescription(secrets) {
    return TextEditor.enrichHTML(this.system.description, {
      secrets,
      rollData: this.getRollData(),
      relativeTo: this,
    });
  }
}
