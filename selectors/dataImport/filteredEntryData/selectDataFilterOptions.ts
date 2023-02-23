import { RootState } from "@reducers/index";

function selectDataFilterOptions(state: RootState) {
  return state.dataImport.dataFilters.filterOptions;
}

export default selectDataFilterOptions;
