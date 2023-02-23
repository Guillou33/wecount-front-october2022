import { createSelector } from "reselect";

import { RootState } from "@reducers/index";

const selectVisibleColumns = createSelector(
  [(state: RootState) => state.dataImport.tableSettings.columns],
  columns => columns.filter(column => column.isVisible)
);

export default selectVisibleColumns;
