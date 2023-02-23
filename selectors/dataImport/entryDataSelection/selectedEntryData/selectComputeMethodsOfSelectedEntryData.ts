import { createSelector } from "reselect";

import { getComputeMethodValue } from "@lib/core/dataImport/computeMethod";

import selectAllSelectedEntryData from "./selectAllSelectedEntryData";

const selectComputeMethodsOfSelectedEntryData = createSelector(
  [selectAllSelectedEntryData],
  selectedEntries => {
    const computeMethodsHashMap = selectedEntries.reduce((acc, entryData) => {
      const computeMethodValue = getComputeMethodValue(entryData.computeMethod);
      if (computeMethodValue == null) {
        acc[-1] = null;
      } else {
        acc[computeMethodValue] = computeMethodValue;
      }
      return acc;
    }, {} as Record<string, string | null>);
    return Object.values(computeMethodsHashMap);
  }
);

export default selectComputeMethodsOfSelectedEntryData;
