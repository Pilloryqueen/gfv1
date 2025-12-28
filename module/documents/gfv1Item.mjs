export default class GFv1Item extends Item {
  static getDefaultArtwork(data) {
    console.log("DefaultArtwork", data);
    switch (data.type) {
      case "asset":
        return { img: "icons/svg/chest.svg" };
      case "bond":
        return { img: "icons/svg/cowled.svg" };
      case "gorgonClass":
        return { img: "icons/svg/radiation.svg" };
      case "identity":
        return { img: "icons/svg/aura.svg" };
      case "playbook":
        return { img: "icons/svg/book.svg" };
      case "rule":
        return { img: "icons/svg/thrust.svg" };
      case "tag":
        return { img: "icons/svg/wingfoot.svg" };
      default:
        return Item.getDefaultArtwork(data);
    }
  }

  async _preCreate(data, options, user) {
    await super._preCreate(data, options, user);

    if (this.pack) {
      const pack = game.packs.get(this.pack);
      const flags = pack.metadata.flags.gfv1;
      if (flags.playbookType) {
        if (!data.system) data.system = {};
        if (!data.system.playbookType)
          data.system.playbookType = flags.playbookType;
      }
    }
    return this.updateSource(data);
  }
}
