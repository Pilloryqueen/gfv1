import { DialogHelper } from "../util/dialogHelper.mjs";

const { HTMLField, ArrayField, StringField, DocumentIdField } =
  foundry.data.fields;

const TypeDataModel = foundry.abstract.TypeDataModel;

export function playbookTypes() {
  return Object.keys(CONFIG.GFV1.playbooks);
}

export function defaultPlaybook() {
  return playbookTypes()[0];
}

export class PlaybookDataModel extends TypeDataModel {
  static defineSchema() {
    return {
      description: new HTMLField(),
      playbookType: new StringField({
        required: true,
        initial: defaultPlaybook,
        choices: playbookTypes,
      }),
      bonds: new ArrayField(new StringField({ required: true }), {
        required: true,
        initial: [],
      }),
      assets: new ArrayField(new StringField({ required: true }), {
        required: true,
        initial: [],
      }),
      _rules: new ArrayField(new DocumentIdField({ required: true }), {
        required: true,
        initial: [],
      }),
    };
  }

  get rules() {
    const rules = this.parent.system._rules.map((ref) => game.items.get(ref));
    return rules;
  }

  async addRule(rule) {
    if (rule.system.playbookType !== this.parent.system.playbookType) {
      await DialogHelper.warn_playbook_import(rule, this.parent);
    }
    const _rules = this.parent.system._rules;
    _rules.push(rule.id);
    return this.parent.update({ system: { _rules } });
  }

  async deleteRule(index) {
    const _rules = this.parent.system._rules;
    _rules.splice(index, 1);
    return this.parent.update({ system: { _rules } });
  }
}

export class FramePlaybookDataModel extends PlaybookDataModel {}
export class GirlPlaybookDataModel extends PlaybookDataModel {}
