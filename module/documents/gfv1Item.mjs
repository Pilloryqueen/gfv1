export default class GFv1Item extends Item {
  async _preCreate(data, options, user) {
    await super._preCreate(data, options, user);
    console.log(this);

    switch (data.type) {
      case "asset":
        if (!data.img) {
          data.img = "icons/svg/chest.svg";
        }
        break;
      case "bond":
        if (!data.img) {
          data.img = "icons/svg/cowled.svg";
        }
        break;
      case "gorgonClass":
        if (!data.img) {
          data.img = "icons/svg/radiation.svg";
        }
        break;
      case "identity":
        if (!data.img) {
          data.img = "icons/svg/aura.svg";
        }
        break;
      case "playbook":
        if (!data.img) {
          data.img = "icons/svg/book.svg";
        }
        break;
      case "rule":
        if (!data.img) {
          data.img = "icons/svg/thrust.svg";
        }
        break;
      case "tag":
        if (!data.img) {
          data.img = "icons/svg/wingfoot.svg";
        }
        break;
    }

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
