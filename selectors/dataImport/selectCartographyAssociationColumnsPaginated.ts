import { createSelector } from "reselect";

import selectColumnViewOffset from "./selectColumnViewOffset";
import selectCartographyAssociationColumns from "./selectCartographyAssociationColumns";

import { MAX_DISPLAYED_COLUMN_NUMBER } from "@lib/core/dataImport/columnConfig";

const selectCartographyAssociationColumnsPaginated = createSelector(
  [selectCartographyAssociationColumns, selectColumnViewOffset],
  (columns, columnViewOffset) =>
    columns.slice(
      columnViewOffset,
      columnViewOffset + MAX_DISPLAYED_COLUMN_NUMBER
    )
);

export default selectCartographyAssociationColumnsPaginated;
