import { createSelector } from "reselect";

import selectFilteredActivityEntriesForCartography from "@selectors/activityEntries/selectFilteredActivityEntriesForCartography";

const selectFilteredActivityModelIds = createSelector(
  selectFilteredActivityEntriesForCartography,
  filteredEntries => {
    const filteredActivityModelIds = filteredEntries.map(
      entry => entry.activityModelId
    );
    return filteredActivityModelIds.reduce((acc, activityModelId) => {
      acc[activityModelId] = true;
      return acc;
    }, {} as Record<number, true>);
  }
);

export default selectFilteredActivityModelIds;
