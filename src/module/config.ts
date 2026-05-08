const bondLevels = {
  none: "GFv1.config.bondLevels.none",
  npc: "GFv1.config.bondLevels.npc",
  low: "GFv1.config.bondLevels.low",
  med: "GFv1.config.bondLevels.med",
  high: "GFv1.config.bondLevels.high",
};

const strainLevels = {
  none: "GFv1.config.strainLevels.none",
  low: "GFv1.config.strainLevels.low",
  high: "GFv1.config.strainLevels.high",
};

const defaultPlaybook = "framePlaybook";
const playbooks = {
  framePlaybook: "GFv1.config.playbooks.frame",
  pilotPlaybook: "GFv1.config.playbooks.pilot",
  handlerPlaybook: "GFv1.config.playbooks.handler",
  gorgonType: "GFv1.config.playbooks.gorgon",
};

const maxIdentities = 4;

const maxAssets = {
  frame: 5,
  pilot: 4,
};

export const GFV1 = {
  bondLevels,
  strainLevels,
  defaultPlaybook,
  playbooks,
  maxIdentities,
  maxAssets,
} as const;
