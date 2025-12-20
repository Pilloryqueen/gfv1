import BaseItemDataModel from "../baseItemDataModel.mjs";
import DialogHelper from "../../util/dialogHelper.mjs";
import fromUuid from "../../util/uuid.mjs";
import PlaybookTypeField from "../fields/playbookTypeField.mjs";

const { HTMLField, ArrayField, StringField, DocumentUUIDField } =
  foundry.data.fields;

export default class PlaybookDataModel extends BaseItemDataModel {
  static type = "playbook";
  static defineSchema() {
    return {
      description: new HTMLField(),
      playbookType: new PlaybookTypeField({
        required: true,
      }),
      bonds: new ArrayField(new StringField({ required: true }), {
        required: true,
        initial: [],
      }),
      assets: new ArrayField(new StringField({ required: true }), {
        required: true,
        initial: [],
      }),
      _rules: new ArrayField(new DocumentUUIDField({ required: true }), {
        required: true,
        initial: [],
      }),
    };
  }

  async prepareContext(context) {
    await super.prepareContext(context);

    context.rules = await this.getRules();
  }

  async getRules() {
    return Promise.all(this._rules.map((uuid) => fromUuid(uuid)));
  }

  async addRule(uuid) {
    const rule = await fromUuid(uuid);
    if (rule.system.playbookType !== this.playbookType) {
      await DialogHelper.warn_playbook_import(rule, this.parent);
    }
    const _rules = this._rules;
    _rules.push(rule.uuid);
    return this.parent.update({ system: { _rules } });
  }

  async deleteRule(index) {
    const _rules = this._rules;
    _rules.splice(index, 1);
    return this.parent.update({ system: { _rules } });
  }
}
