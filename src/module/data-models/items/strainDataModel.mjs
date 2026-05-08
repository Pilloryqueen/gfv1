import BaseItemDataModel from "../baseItemDataModel.mjs";
import { GFV1 } from "../../config";

const { HTMLField, StringField, ObjectField, NumberField, BooleanField } = foundry.data.fields;

export default class StrainDataModel extends BaseItemDataModel {
  static type = "strain";
  static defineSchema() {
    return {
      tooltip: new StringField({ required: true, initial: "" }),
      description: new HTMLField(),
      secret: new BooleanField({ required: true, initial: false }),
      level: new StringField({
        required: true,
        initial: "low",
        choices: GFV1.strainLevels,
      }),
      tables: new ObjectField({
        required: true,
        initial: initialTables,
      }),
      options: new NumberField({
        required: true,
        initial: 6,
      }),
    };
  }

  showLevel() {
    return this.item.system.level !== "none";
  }

  static itemListProperties = ["level"];
  _properties = ["level", "secret", "options"];

  async getOutcome(val) {
    // TODO: Make it possible to detect outcome
  }
}

class StrainTable {
  constructor(label) {
    this.label = label;
  }
}

function initialTables() {
  return Object.fromEntries(
    Object.entries(GFV1.strainLevels).map((level, label) => {
      return [level, new StrainTable(label)];
    })
  );
}

/**
 * Void strain
 *  - has 2 tables low and high
 *    - high table has a size (6) which is how many sides dice are rolled for the table
 *      - for each rollable outcome there's 2 events to choose from
 */
