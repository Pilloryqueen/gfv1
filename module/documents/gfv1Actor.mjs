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
      throw new Gfv1Error(
        `${this.name} (id: ${this.id}) is not parent of ${tag.id} (parent.id: ${tag.parent?.id})`,
      );
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
}
