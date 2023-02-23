import { createSelector } from "reselect";

import { RootState } from "@reducers/index";

const selectAllEntryData = createSelector(
  [(state: RootState) => state.dataImport.entryData.entryDataList],
  entryDataList => Object.values(entryDataList)
);

export default selectAllEntryData;
