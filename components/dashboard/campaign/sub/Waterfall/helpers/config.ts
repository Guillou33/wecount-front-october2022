import {
  WaterfallData,
  WaterfallDataName,
  waterfallDataNames,
} from "@hooks/core/waterfall/helpers/waterfallData";

type PreviousAxis = { [key in WaterfallDataName]: WaterfallDataName[] };
const previousAxis: PreviousAxis = waterfallDataNames.reduce((acc, axis) => {
  acc[axis] = [];
  for (let previous of waterfallDataNames) {
    if (previous === axis) {
      break;
    }
    acc[axis].push(previous);
  }
  return acc;
}, {} as PreviousAxis);

const isReduction: { [key in keyof WaterfallData]: boolean } = {
  newSitesOnly: false,
  newProductsOnly: false,
  newSitesAndProducts: false,
  otherNewEntries: false,
  feAugmentations: false,
  inputsAugmentations: false,
  oldSitesOnly: true,
  oldProductsOnly: true,
  oldSitesAndProducts: true,
  otherOldEntries: true,
  feReduction: true,
  inputsReduction: true,
};

export { previousAxis, isReduction };
