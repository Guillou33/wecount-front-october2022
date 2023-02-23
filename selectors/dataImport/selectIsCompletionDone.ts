import { createSelector } from "reselect";

import { RootState } from "@reducers/index";

import selectAllEntryData from "./selectAllEntryData";
import { getErrorsForCompletion } from "@lib/core/dataImport/getEntryDataError";

const selectIsCompletionDone = createSelector(
  [selectAllEntryData, (state: RootState) => state.core.emissionFactor.mapping],
  (entryDataList, emissionFactorMapping) =>
    entryDataList.every(entryData => {
      const errors = getErrorsForCompletion(entryData, emissionFactorMapping);
      return errors.length === 0;
    })
);

export default selectIsCompletionDone;
