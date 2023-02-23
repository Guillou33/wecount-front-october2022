import { createSelector } from "reselect";

import { MAX_DISPLAYED_COLUMN_NUMBER } from "@lib/core/dataImport/columnConfig";

import selectColumnViewOffset from "./selectColumnViewOffset";
import selectVisibleColumns from "./selectVisibleColumns";

const selectCompletionStepColumnsPaginated = createSelector(
  [selectVisibleColumns, selectColumnViewOffset],
  (columns, columnViewOffset) =>
    columns.slice(
      columnViewOffset,
      columnViewOffset + MAX_DISPLAYED_COLUMN_NUMBER
    )
);

export default selectCompletionStepColumnsPaginated;
