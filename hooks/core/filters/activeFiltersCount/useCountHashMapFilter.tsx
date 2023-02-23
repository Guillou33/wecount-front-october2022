import { useSelector } from "react-redux";

import { RootState } from "@reducers/index";
import { IdHashMapFilterName, StatusHashMapFilterName, PresenceHashMap } from "@reducers/filters/filtersReducer";

function useCountHashMapFilter(filterName: IdHashMapFilterName | StatusHashMapFilterName) {
  const filter = useSelector<RootState, object>(
    state => state.filters[filterName]
  );
  if (filter == null) {
    return 0;
  }
  return Object.keys(filter).length;
}

export default useCountHashMapFilter;