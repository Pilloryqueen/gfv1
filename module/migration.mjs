class Migration {
  noOp(_) {}

  constructor({ actors = undefined, items = undefined }) {
    this.actorMigration = actors || this.noOp;
    this.itemMigration = items || this.noOp;
  }

  apply() {
    return Promise.all([
      forInvalid(game.actors, this.actorMigration),
      forInvalid(game.items, this.itemMigration),
      ...game.actors.contents.map((actor) => {
        return forInvalid(actor.items, this.itemMigration);
      }),
      ...game.packs.contents.map((pack) => {
        return forInvalid(actor.pack, this.itemMigration);
      }),
    ]);
  }

  async forInvalid(collection, fn) {
    return Promise.all(
      Array.from(collection.invalidDocumentIds).map((id) => {
        return fn(collection.getInvalid(id));
      })
    );
  }
}

export async function migrateWorld(oldVersion = "0.0.0") {
  ui.notifications.info(
    `Applying migrations for GIRLFRAME version ${game.system.version}. Please wait...`,
    { permanent: true }
  );

  await runMigrations(oldVersion);

  ui.notifications.info(
    `Migrations for GIRLFRAME version ${game.system.version} completed!`,
    { permanent: true }
  );
}

async function runMigrations(oldVersion) {
  const versions = Object.keys(migrations)
    .filter((key) => semverCompare(key, oldVersion) > 0)
    .sort(semverCompare);

  versions.forEach(async (v) => {
    console.log(`GFV1 | migrating to ${v}`);
    await migrations[v].apply();
  });
}

// key: the version reached by migration
export const migrations = {
  "0.3.0": new Migration({
    actors: (actor) => {
      if (actor.type === "girl") return actor.update({ type: "pilot" });
    },
    items: (item) => {
      if (
        item.validationFailures.fields.fields.system.fields.playbookType
          ?.invalidValue === "girlPlaybook"
      ) {
        item.update({ system: { playbookType: "pilotPlaybook" } });
      }
    },
  }),
};

function semverCompare(v1, v2) {
  const p1 = v1.split(".").map(Number);
  const p2 = v2.split(".").map(Number);
  const l = Math.max(p1.length, p2.length);

  for (let i = 0; i < l; ++i) {
    if (p1[i] ?? 0 > p2[i] ?? 0) return 1;
    if (p1[i] ?? 0 < p2[i] ?? 0) return -1;
  }
  return 0;
}
