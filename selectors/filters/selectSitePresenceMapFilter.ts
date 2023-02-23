import { RootState } from "@reducers/index";

import {
  IdHashMapFilterName,
  PresenceHashMap,
} from "@reducers/filters/filtersReducer";

function selectSitePresenceMapFilter(
  state: RootState,
  filterName: IdHashMapFilterName
): PresenceHashMap<number> {
  return state.filters[filterName];
}

export default selectSitePresenceMapFilter;
