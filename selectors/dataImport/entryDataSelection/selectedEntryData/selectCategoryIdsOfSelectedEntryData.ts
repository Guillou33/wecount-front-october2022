import { createSelector } from "reselect";

import selectAllSelectedEntryData from "./selectAllSelectedEntryData";

const selectCategoryIdsOfSelectedEntryData = createSelector(
  [selectAllSelectedEntryData],
  selectedEntries => {
    const categoryIdsHashMap = selectedEntries.reduce((acc, entryData) => {
      const categoryId = entryData.activityCategory.value;
      if (categoryId == null) {
        acc[-1] = null;
      } else {
        acc[categoryId] = categoryId;
      }
      return acc;
    }, {} as Record<number, number | null>);
    return Object.values(categoryIdsHashMap);
  }
);

export default selectCategoryIdsOfSelectedEntryData;
