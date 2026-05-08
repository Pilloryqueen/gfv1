import Playbook from "../sheets/elements/playbook.mjs";

export default class Gfv1Actor extends Actor {
  async enrichedDescription(secrets) {
    return TextEditor.enrichHTML(this.system.description, {
      secrets,
      rollData: this.getRollData(),
      relativeTo: this,
    });
  }

  async embraceTag(tag) {
    if (tag.parent !== this) {
      throw new Gfv1Error(`${this.name} (id: ${this.id}) is not parent of ${tag.id} (parent.id: ${tag.parent?.id})`);
    }

    const identity = {
      ...tag,
      type: "identity",
      system: {
        ...tag.system,
        marked: false,
        inLimit: true,
      },
    };
    await Item.create(identity, { parent: this });
    await tag.delete();
  }

  /**
   * Import a playbook onto character
   * @param {Playbook} playbook playbook to import
   * @param {Array} items items from that playbook to import
   */
  async importPlaybook(playbook, items) {
    const playbookType = playbook.system.playbookType;
    if (!this.system.allowedPlaybookTypes.includes(playbookType)) return;

    await this.system.addItems(items);
    const nameKey = `system._${playbookType}`;
    await this.update({ [nameKey]: playbook.name });
  }
}
