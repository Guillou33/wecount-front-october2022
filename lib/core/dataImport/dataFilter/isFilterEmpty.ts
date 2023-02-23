import { FilterOption } from "@reducers/dataImport/dataFiltersReducer";

function isFilterEmpty({ value }: Partial<FilterOption>): boolean {
  return value === "";
}

export default isFilterEmpty;
