import { DataFiltersTypes } from "@actions/dataImport/dataFilters/types";

import { EntryDataKey } from "@lib/core/dataImport/columnConfig";
import { FilterOption } from "@reducers/dataImport/dataFiltersReducer";

export type Action = SetColumnFilter | ResetDataFilters;

interface SetColumnFilter {
  type: DataFiltersTypes.SET_COLUMN_FILTER;
  payload: {
    column: EntryDataKey;
    filterOption: Partial<FilterOption>;
  };
}

export function setColumnFilter(
  payload: SetColumnFilter["payload"]
): SetColumnFilter {
  return {
    type: DataFiltersTypes.SET_COLUMN_FILTER,
    payload,
  };
}

interface ResetDataFilters {
  type: DataFiltersTypes.RESET_DATA_FILTERS;
}

export function resetDataFilters(): ResetDataFilters {
  return {
    type: DataFiltersTypes.RESET_DATA_FILTERS,
  };
}
