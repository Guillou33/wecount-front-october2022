import { FilterOption } from "@reducers/dataImport/dataFiltersReducer";

function getEmptyFilterOption(): FilterOption {
  return {
    value: "",
  };
}

export default getEmptyFilterOption;
