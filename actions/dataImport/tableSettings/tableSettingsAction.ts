import { TableSettingsTypes } from "./types";

import { EntryDataKey, ColumnSetting } from "@lib/core/dataImport/columnConfig";

export type Action =
  | SetColumns
  | ToggleColumnVisibility
  | MoveColumnViewLeft
  | MoveColumnViewRight
  | SetColumnPage
  | Reset;

interface SetColumns {
  type: TableSettingsTypes.SET_COLUMNS;
  payload: ColumnSetting[];
}

interface ToggleColumnVisibility {
  type: TableSettingsTypes.TOGGLE_COLUMN_VISIBILITY;
  payload: {
    entryDataKey: EntryDataKey;
    ignoredColumns?: EntryDataKey[];
  };
}

interface MoveColumnViewLeft {
  type: TableSettingsTypes.MOVE_COLUMN_VIEW_LEFT;
}

interface MoveColumnViewRight {
  type: TableSettingsTypes.MOVE_COLUMN_VIEW_RIGHT;
  payload?: {
    ignoredColumns?: EntryDataKey[];
  };
}

interface SetColumnPage {
  type: TableSettingsTypes.SET_COLUMN_PAGE;
  payload: {
    page: number;
  };
}

interface Reset {
  type: TableSettingsTypes.RESET;
}

export function setColumns(payload: SetColumns["payload"]): SetColumns {
  return {
    type: TableSettingsTypes.SET_COLUMNS,
    payload,
  };
}

export function toggleColumnVisibility(
  payload: ToggleColumnVisibility["payload"]
): ToggleColumnVisibility {
  return {
    type: TableSettingsTypes.TOGGLE_COLUMN_VISIBILITY,
    payload,
  };
}

export function moveColumnViewLeft(): MoveColumnViewLeft {
  return {
    type: TableSettingsTypes.MOVE_COLUMN_VIEW_LEFT,
  };
}

export function moveColumnViewRight(
  payload?: MoveColumnViewRight["payload"]
): MoveColumnViewRight {
  return {
    type: TableSettingsTypes.MOVE_COLUMN_VIEW_RIGHT,
    payload,
  };
}

export function setColumnPage(
  payload: SetColumnPage["payload"]
): SetColumnPage {
  return {
    type: TableSettingsTypes.SET_COLUMN_PAGE,
    payload,
  };
}

export function reset(): Reset {
  return {
    type: TableSettingsTypes.RESET,
  };
}
