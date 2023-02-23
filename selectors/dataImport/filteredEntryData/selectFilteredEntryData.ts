import { createSelector } from "reselect";

import { EntryDataKey } from "@lib/core/dataImport/columnConfig";
import { EntryData } from "@reducers/dataImport/entryDataReducer";
import {
  MappableDataNames,
  mappableDataNames,
} from "@lib/core/dataImport/mappableData";
import { FilterOption } from "@reducers/dataImport/dataFiltersReducer";

import { isNonStandard } from "@lib/core/dataImport/computeMethod";

import mapObject from "@lib/utils/mapObject";

import selectAllEntryData from "@selectors/dataImport/selectAllEntryData";

import { RootState } from "@reducers/index";

type Matcher = (entryData: EntryData, filterOption: FilterOption) => boolean;

type Matchers = {
  [key in EntryDataKey]?: Matcher;
};

function makeMappbleDataMatcher(key: MappableDataNames): Matcher {
  return (entryData: EntryData, filterOption: FilterOption) => {
    const entryDataValue = entryData[key].value;
    const entryDataEntityName = entryData[key].entityName;
    const triedInput = entryData[key].triedInput ?? "";

    const valueToSearchIn =
      entryDataValue != null ? entryDataEntityName : triedInput;

    return valueToSearchIn
      .toLowerCase()
      .includes(filterOption.value.toLowerCase());
  };
}

function makeStringMatcher(entryDataKey: EntryDataKey): Matcher {
  return (entryData, filterOption) => {
    return (
      entryData[entryDataKey]
        ?.toString()
        .toLowerCase()
        .includes(filterOption.value.toLowerCase()) ?? false
    );
  };
}

const matchers: Matchers = {
  ...mapObject(mappableDataNames, (v, i, o, key) =>
    makeMappbleDataMatcher(key)
  ),
  commentary: makeStringMatcher("commentary"),
  inputInstruction: makeStringMatcher("inputInstruction"),
  input1: makeStringMatcher("input1"),
  input2: makeStringMatcher("input2"),
  input1Unit: makeStringMatcher("input1Unit"),
  input2Unit: makeStringMatcher("input2Unit"),
  source: makeStringMatcher("source"),
  computeMethod: (entryData, filterOption) => {
    const { computeMethod } = entryData;
    if (computeMethod == null || isNonStandard(computeMethod)) {
      return false;
    }
    return computeMethod.name
      .toLowerCase()
      .includes(filterOption.value.toLowerCase());
  },
  emissionFactor: (entryData, filterOption) => {
    return (
      entryData.emissionFactor?.name
        .toLowerCase()
        .includes(filterOption.value.toLowerCase()) ?? false
    );
  },
};

const selectFilteredEntryData = createSelector(
  [(state: RootState) => state.dataImport.dataFilters, selectAllEntryData],
  (dataFilters, allEntryData) => {
    const { filterOptions, entryDataIdsOverride } = dataFilters;

    if (Object.values(filterOptions).length === 0) {
      return allEntryData;
    }

    return allEntryData.filter(entryData => {
      return (
        entryDataIdsOverride[entryData.id] ||
        Object.entries(filterOptions).every(([entryDataKey, filterOption]) => {
          const matcher = matchers[entryDataKey as EntryDataKey];
          if (filterOption == null) {
            return false;
          }
          return matcher?.(entryData, filterOption);
        })
      );
    });
  }
);

export default selectFilteredEntryData;
