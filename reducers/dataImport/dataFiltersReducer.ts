import immer from "immer";

import { DataFiltersTypes } from "@actions/dataImport/dataFilters/types";
import { DataImportTypes } from "@actions/dataImport/entryData/types";

import { Action } from "@actions/dataImport/dataFilters/dataFiltersActions";
import { Action as DataImportAction } from "@actions/dataImport/entryData/entryDataActions";

import { EntryDataKey } from "@lib/core/dataImport/columnConfig";
import getEmptyFilterOption from "@lib/core/dataImport/dataFilter/getEmptyFilterOption";
import isFilterEmpty from "@lib/core/dataImport/dataFilter/isFilterEmpty";

export type FilterOption = {
  value: string;
};

type State = {
  filterOptions: { [key in EntryDataKey]?: FilterOption };
  entryDataIdsOverride: Record<string, true>; // these entries are considered a match regardless of filter values. It is for a better UX when a matching entries is edited by the user, and filtered out by the filter
};

const initialState: State = {
  filterOptions: {},
  entryDataIdsOverride: {},
};

function reducer(
  state: State = initialState,
  action: Action | DataImportAction
): State {
  switch (action.type) {
    case DataFiltersTypes.SET_COLUMN_FILTER: {
      const { column, filterOption } = action.payload;
      return immer(state, draftState => {
        if (
          isFilterEmpty(filterOption) &&
          draftState.filterOptions[column] == null
        ) {
          return;
        }

        const newFilterOption = {
          ...getEmptyFilterOption(),
          ...draftState.filterOptions[column],
          ...filterOption,
        };

        if (isFilterEmpty(newFilterOption)) {
          delete draftState.filterOptions[column];
        } else {
          draftState.filterOptions[column] = newFilterOption;
        }
        draftState.entryDataIdsOverride = {};
      });
    }
    case DataFiltersTypes.RESET_DATA_FILTERS: {
      return { ...initialState };
    }
    case DataImportTypes.SET_COMPUTE_METHOD:
    case DataImportTypes.SET_EMISSION_FACTOR:
    case DataImportTypes.SET_MAPPABLE_DATA: {
      const { entryDataIds } = action.payload;
      return immer(state, draftState => {
        if (Object.values(draftState.filterOptions).length > 0) {
          entryDataIds.forEach(entryId => {
            draftState.entryDataIdsOverride[entryId] = true;
          });
        }
      });
    }
    case DataImportTypes.TAG_CLICKED:
    case DataImportTypes.SET_NUMBER_DATA:
    case DataImportTypes.SET_STRING_DATA: {
      const { entryDataId } = action.payload;
      return immer(state, draftState => {
        draftState.entryDataIdsOverride[entryDataId] = true;
      });
    }
    case DataImportTypes.SET_PARSING: {
      return { ...initialState };
    }
    default:
      return state;
  }
}

export default reducer;
