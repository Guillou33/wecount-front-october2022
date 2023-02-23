import { RootState } from "@reducers/index";

import { ExcludedFilterName } from "@reducers/filters/filtersReducer";

function selectNotExcludedFilter(
    state: RootState,
    filterName: ExcludedFilterName
): number {
    return state.filters[filterName].excludedEntries;
}

export default selectNotExcludedFilter;
