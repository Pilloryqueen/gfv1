import { GFV1 } from "../config.mjs";

export class DialogHelper {
  static async confirmAdopt() {
    return this._promptConfirm({
      title: game.i18n.localize("GFv1.item.tag.adopt.title"),
      content: game.i18n.localize("GFv1.item.tag.adopt.content"),
    });
  }

  static async selectImport(names, type) {
    const content = await renderTemplate(
      "systems/gfv1/templates/dialog/select.hbs",
      { names, type }
    );
    try {
      return await foundry.applications.api.DialogV2.prompt({
        window: {
          title: game.i18n.format("GFv1.dialog.selectImport.title", { type }),
        },
        content,
        modal: true,
        ok: {
          confirm: game.i18n.localize("Confirm"),
          callback: (event, button, dialog) => {
            return Array.from(button.form.elements)
              .filter((e) => e.checked)
              .map((e) => e.value);
          },
        },
      });
    } catch {
      return [];
    }
  }

  static async warn_playbook_import(play, playbook) {
    const context = {
      rule_name: play.name,
      rule_type: game.i18n.localize(GFV1.playbooks[play.system.playbookType]),
      playbook_name: playbook.name,
      playbook_type: game.i18n.localize(
        GFV1.playbooks[playbook.system.playbookType]
      ),
    };
    const content = game.i18n.format(
      "GFv1.dialog.warnPlaybookImport.content",
      context
    );
    const buttons = [
      {
        action: "fix",
        default: true,
        label: game.i18n.format("GFv1.dialog.warnPlaybookImport.fix", context),
        callback: fix,
      },
      {
        action: "abort",
        label: game.i18n.format(
          "GFv1.dialog.warnPlaybookImport.abort",
          context
        ),
        callback: abort,
      },
      {
        action: "continue",
        label: game.i18n.format(
          "GFv1.dialog.warnPlaybookImport.continue",
          context
        ),
      },
    ];
    return await foundry.applications.api.DialogV2.wait({
      window: {
        title: game.i18n.localize("GFv1.dialog.warnPlaybookImport.title"),
      },
      content,
      buttons,
      modal: true,
    });
    async function fix() {
      return play.update({
        system: { playbookType: playbook.system.playbookType },
      });
    }
    async function abort(event, button, dialog) {
      dialog.close();
      return Promise.reject("aborted import: Wrong playbook type");
    }
  }

  static async rollHeatQuery(maxHeat) {
    return this._queryNumber({
      title: game.i18n.localize("GFv1.roll.spendHeat.title"),
      label: game.i18n.localize("GFv1.roll.spendHeat.label"),
      min: 0,
      max: maxHeat,
    });
  }

  static async rollModifierQuery() {
    return this._queryNumber({
      title: game.i18n.localize("GFv1.roll.modifier.title"),
      label: game.i18n.localize("GFv1.roll.modifier.label"),
      min: -999,
      max: 999,
    });
  }

  static async confirmDelete(type, parent) {
    return this._promptConfirm({
      title: game.i18n.format("GFv1.dialog.delete.title", { type }),
      content: game.i18n.format("GFv1.dialog.delete.content", {
        type,
        parent,
      }),
    });
  }

  /**
   * Displays a prompt to confirm action
   */
  static async _promptConfirm(options) {
    const data = foundry.utils.mergeObject(
      {
        title: game.i18n.localize("AreYouSure"),
        content: game.i18n.localize("AreYouSure"),
        onYes: () => {
          return true;
        },
        onNo: () => {
          return false;
        },
      },
      options
    );

    return foundry.applications.api.DialogV2.confirm({
      window: { title: data.title },
      content: data.content,
      yes: { callback: data.onYes },
      no: { callback: data.onNo },
    });
  }

  /**
   * Queries for a number, and invokes onSuccess with that number
   */
  static async _queryNumber(options) {
    const defaults = {
      title: "",
      label: "",
      min: 0,
      max: 9999,
      step: 1,
      autofocus: true,
      confirm: game.i18n.localize("Confirm"),
    };
    const o = foundry.utils.mergeObject(defaults, options);
    const content = await renderTemplate(
      "systems/gfv1/templates/dialog/queryNumber.hbs",
      o
    );
    try {
      return await foundry.applications.api.DialogV2.prompt({
        window: { title: o.title },
        content,
        ok: {
          label: o.confirm,
          callback: (event, button, dialog) =>
            button.form.elements.num.valueAsNumber,
        },
      });
    } catch {
      return undefined;
    }
  }
}
