import { RootState } from "@reducers/index";

import {
  StatusHashMapFilterName,
  PresenceHashMap,
} from "@reducers/filters/filtersReducer";

import { Status } from "@custom-types/core/Status";

function selectStatusFilter(
  state: RootState,
  filterName: StatusHashMapFilterName
): PresenceHashMap<Status> {
  return state.filters[filterName];
}

export default selectStatusFilter;
