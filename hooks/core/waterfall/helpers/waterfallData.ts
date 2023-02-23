export const waterfallDataNames= [
  "newSitesOnly",
  "newProductsOnly",
  "newSitesAndProducts",
  "otherNewEntries",
  "feAugmentations",
  "inputsAugmentations",
  "oldSitesOnly",
  "oldProductsOnly",
  "oldSitesAndProducts",
  "otherOldEntries",
  "feReduction",
  "inputsReduction",
] as const;

export type WaterfallDataName = typeof waterfallDataNames[number];
export type WaterfallData = {[key in WaterfallDataName]: number}

export function getInitialWaterfallData(): WaterfallData {
  return {
    newSitesAndProducts: 0,
    newSitesOnly: 0,
    newProductsOnly: 0,
    otherNewEntries: 0,
    inputsAugmentations: 0,
    feAugmentations: 0,
    oldSitesAndProducts: 0,
    oldSitesOnly: 0,
    oldProductsOnly: 0,
    otherOldEntries: 0,
    inputsReduction: 0,
    feReduction: 0,
  };
}
