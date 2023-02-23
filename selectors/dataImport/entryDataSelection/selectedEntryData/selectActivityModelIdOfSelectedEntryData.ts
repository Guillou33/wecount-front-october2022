import { createSelector } from "reselect";

import selectAllSelectedEntryData from "./selectAllSelectedEntryData";

const selectActivityModelIdOfSelectedEntryData = createSelector(
  [selectAllSelectedEntryData],
  selectedEntries => {
    const activityModelIdsHashMap = selectedEntries.reduce((acc, entryData) => {
      const activityModelId = entryData.activityModel.value;
      if (activityModelId == null) {
        acc[-1] = null;
      } else {
        acc[activityModelId] = activityModelId;
      }
      return acc;
    }, {} as Record<number, number | null>);
    return Object.values(activityModelIdsHashMap);
  }
);

export default selectActivityModelIdOfSelectedEntryData;