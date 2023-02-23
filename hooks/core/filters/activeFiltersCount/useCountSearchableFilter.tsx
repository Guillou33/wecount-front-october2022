import { useSelector } from "react-redux";

import { RootState } from "@reducers/index";
import { SearchableFilterName } from "@reducers/filters/filtersReducer";

function useCountSearchableFilter(filterName: SearchableFilterName) {
  const filter = useSelector<RootState, object>(
    state => state.filters[filterName].elementIds
  );
  if (filter == null) {
    return 0;
  }
  return Object.keys(filter).length;
}

export default useCountSearchableFilter;
