import { createSelector } from "reselect";

import selectAllSelectedEntryData from "./selectAllSelectedEntryData";

const selectEmissionFactorIdsOfSelectedEntryData = createSelector(
  [selectAllSelectedEntryData],
  selectedEntries => {
    const emissionFactorIdsHashMap = selectedEntries.reduce((acc, entryData) => {
      const emissionFactorId = entryData.emissionFactor?.id;
      if (emissionFactorId == null) {
        acc[-1] = null;
      } else {
        acc[emissionFactorId] = emissionFactorId;
      }
      return acc;
    }, {} as Record<number, number | null>);
    return Object.values(emissionFactorIdsHashMap);
  }
);

export default selectEmissionFactorIdsOfSelectedEntryData;
