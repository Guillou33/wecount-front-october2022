import { createSelector } from "reselect";

import selectColumnViewOffset from "./selectColumnViewOffset";
import selectVisibleColumns from "./selectVisibleColumns";

import { MAX_DISPLAYED_COLUMN_NUMBER } from "@lib/core/dataImport/columnConfig";

import { cartographyAssociationIgnoredColumns } from "@lib/core/dataImport/columnConfig";

const selectCartographyAssociationColumns = createSelector(
  [selectVisibleColumns],
  columns =>
    columns.filter(
      column =>
        !cartographyAssociationIgnoredColumns.includes(column.entryDataKey)
    )
);

export default selectCartographyAssociationColumns;
