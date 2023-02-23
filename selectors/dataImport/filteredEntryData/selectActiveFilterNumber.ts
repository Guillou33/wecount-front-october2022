import { RootState } from "@reducers/index";
import selectDataFilterOptions from "@selectors/dataImport/filteredEntryData/selectDataFilterOptions";

function selectActiveFilterNumber(state: RootState): number {
  const filterOptions = selectDataFilterOptions(state);
  return Object.values(filterOptions).length;
}

export default selectActiveFilterNumber;
