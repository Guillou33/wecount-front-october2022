import { createSelector } from "reselect";

import selectAllSelectedEntryData from "./selectAllSelectedEntryData";

const selectAllSelectedEntryDataIds = createSelector(
  [selectAllSelectedEntryData],
  selectedEntryData => selectedEntryData.map(entryData => entryData.id)
);

export default selectAllSelectedEntryDataIds;
