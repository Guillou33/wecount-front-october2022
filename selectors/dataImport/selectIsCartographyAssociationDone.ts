import { createSelector } from "reselect";

import { getErrorsForCartographyAssociation } from "@lib/core/dataImport/getEntryDataError";

import selectAllEntryData from "./selectAllEntryData";

const selectIsCartographyAssociationDone = createSelector(
  [selectAllEntryData],
  entryDataList =>
    entryDataList.every(entryData => {
      const errors = getErrorsForCartographyAssociation(entryData);
      return errors.length === 0;
    })
);

export default selectIsCartographyAssociationDone;
