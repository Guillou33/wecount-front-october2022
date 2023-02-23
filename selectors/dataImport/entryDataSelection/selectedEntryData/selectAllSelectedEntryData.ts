import { createSelector } from "reselect";

import makeIsSelectedEntryData from "@lib/core/dataImport/makeIsSelectedEntryData";
import selectEntryDataSelection from "@selectors/dataImport/entryDataSelection/selectEntryDataSelection";
import selectFilteredEntryData from "@selectors/dataImport/filteredEntryData/selectFilteredEntryData";

const selectAllSelectedEntryData = createSelector(
  [selectEntryDataSelection, selectFilteredEntryData],
  (entryDataSelection, allEntryData) => {
    // todo optimize when selected is markedEntries, by looping through marked entries directly

    const isEntryDataSelected = makeIsSelectedEntryData(entryDataSelection);

    return allEntryData.filter(entryData => isEntryDataSelected(entryData.id));
  }
);

export default selectAllSelectedEntryData;
