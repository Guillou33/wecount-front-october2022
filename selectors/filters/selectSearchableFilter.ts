import { RootState } from "@reducers/index";

import {
  SearchableFilterName,
  SearchableFilter,
} from "@reducers/filters/filtersReducer";

function selectSearchableFilter(
  state: RootState,
  filterName: SearchableFilterName
): SearchableFilter {
  return state.filters[filterName];
}

export default selectSearchableFilter;
