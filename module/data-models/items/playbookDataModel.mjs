import BaseItemDataModel from "../baseItemDataModel.mjs";
import { DialogHelper } from "../../util/dialogHelper.mjs";
import fromUuid from "../../util/uuid.mjs";
import { GFV1 } from "../../config.mjs";

const { HTMLField, ArrayField, StringField, DocumentUUIDField } =
  foundry.data.fields;

export class PlaybookTypeField extends StringField {
  constructor(options) {
    options.initial = PlaybookTypeField.defaultPlaybook;
    options.choices = PlaybookTypeField.playbookTypes;

    return super(options);
  }

  static playbookTypes() {
    return GFV1.playbooks;
  }

  static defaultPlaybook() {
    return GFV1.defaultPlaybook;
  }
}

export default class PlaybookDataModel extends BaseItemDataModel {
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

  _properties = ["playbookType"];
}

export class Playbook {
  constructor(item, type, itemTypes) {
    this.name = item.system[`_${type}`];
    this.playbookType = type;
    const filter = (item) => {
      return item.system.playbookType === type;
    };
    for (const k in itemTypes) {
      this[k] = item.itemTypes[itemTypes[k]].filter(filter);
    }
  }
}
