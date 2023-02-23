import { RootState } from "@reducers/index";

import { UserDataFilterName } from "@reducers/filters/filtersReducer";

function selectUserDataFilter(
  state: RootState,
  filterName: UserDataFilterName
): number | null {
  return state.filters[filterName].userId;
}

export default selectUserDataFilter;
