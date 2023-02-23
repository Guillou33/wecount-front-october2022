import immer from "immer";

import { TableSettingsTypes } from "@actions/dataImport/tableSettings/types";
import { Action } from "@actions/dataImport/tableSettings/tableSettingsAction";

import {
  MAX_DISPLAYED_COLUMN_NUMBER,
  INITIAL_COLUMNS_SETTINGS,
  ColumnSetting,
} from "@lib/core/dataImport/columnConfig";

export type State = {
  columns: ColumnSetting[];
  columnViewOffset: number;
};

const INITIAL_STATE: State = {
  columns: INITIAL_COLUMNS_SETTINGS,
  columnViewOffset: 0,
};

function reducer(state: State = INITIAL_STATE, action: Action): State {
  switch (action.type) {
    case TableSettingsTypes.SET_COLUMNS: {
      return { ...state, columns: action.payload };
    }
    case TableSettingsTypes.TOGGLE_COLUMN_VISIBILITY: {
      const { entryDataKey, ignoredColumns = [] } = action.payload;
      return immer(state, draftState => {
        const column = draftState.columns.find(
          column => column.entryDataKey === entryDataKey
        );
        if (column != null) {
          column.isVisible = !column.isVisible;

          const visibleColumns = draftState.columns.filter(
            column =>
              column.isVisible && !ignoredColumns.includes(column.entryDataKey)
          );
          if (visibleColumns.length <= MAX_DISPLAYED_COLUMN_NUMBER) {
            draftState.columnViewOffset = 0;
          }
        }
      });
    }
    case TableSettingsTypes.MOVE_COLUMN_VIEW_LEFT: {
      const columnViewOffset =
        state.columnViewOffset > 0 ? state.columnViewOffset - 1 : 0;
      return {
        ...state,
        columnViewOffset,
      };
    }
    case TableSettingsTypes.MOVE_COLUMN_VIEW_RIGHT: {
      const { ignoredColumns = [] } = action.payload ?? {};
      const visibleColumns = state.columns.filter(
        column =>
          column.isVisible && !ignoredColumns.includes(column.entryDataKey)
      );
      const columnViewOffset =
        visibleColumns[state.columnViewOffset + MAX_DISPLAYED_COLUMN_NUMBER] !=
        null
          ? state.columnViewOffset + 1
          : state.columnViewOffset;

      return {
        ...state,
        columnViewOffset,
      };
    }
    case TableSettingsTypes.SET_COLUMN_PAGE: {
      return {
        ...state,
        columnViewOffset: action.payload.page,
      };
    }
    case TableSettingsTypes.RESET: {
      return INITIAL_STATE;
    }
    default: {
      return state;
    }
  }
}

export default reducer;
