// key: the version reached by migration
const migrations = {};

export class Migration {
  /**
   * @param {Object} callbacks
   * @param {Patches} callbacks.all holds callbacks to apply to ALL documents of a certain type
   * @param {Patches} callbacks.error holds callbacks to apply to documents of a certain type reporting ERRORs
   */
  constructor({ all, error }) {}

  apply() {
    // TODO: Make better system for migrations
  }
}

export default async function migrateWorld(oldVersion) {
  ui.notifications.info(
    `Applying migrations for GIRLFRAME version ${game.system.version}. Please wait...`,
    { permanent: true },
  );

  await runMigrations(oldVersion);

  ui.notifications.info(
    `Migrations for GIRLFRAME version ${game.system.version} completed!`,
    { permanent: true },
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

/**
 * @typedef {Object} Patches
 * @property {Function} items
 * @property {Function} actors
 */
