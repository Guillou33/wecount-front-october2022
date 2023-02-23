import { t } from "i18next";
import { createSelector } from "reselect";
import { EntryDataKey } from "@lib/core/dataImport/columnConfig";
import { EntryData } from "@reducers/dataImport/entryDataReducer";

import { MappableData } from "@lib/core/dataImport/mappableData";
import { isStandard } from "@lib/core/dataImport/computeMethod";
import { ComputeMethodType } from "@custom-types/core/ComputeMethodType";

import selectFilteredEntryData from "@selectors/dataImport/filteredEntryData/selectFilteredEntryData";

const makeSelectSearchSuggestions = <T extends EntryDataKey>(
  entryDataKey: T,
  suggestionProducer: (data: EntryData[T]) => string[]
) =>
  createSelector([selectFilteredEntryData], allEntryData => {
    const dedupValues = allEntryData.reduce((acc, entryData) => {
      const suggestions = suggestionProducer(entryData[entryDataKey]);
      suggestions.forEach(suggestion => {
        if (suggestion !== "") {
          acc[suggestion] = true;
        }
      });
      return acc;
    }, {} as Record<string, true>);
    return Object.keys(dedupValues);
  });

function mappableDataSuggestionProducer(data: MappableData<number>) {
  return [data.value != null ? data.entityName : data.triedInput ?? ""];
}

function basicInputSuggestionProducer(data: string | number | null) {
  return [data?.toString() ?? ""];
}

const selectCategoriesSuggestions = makeSelectSearchSuggestions(
  "activityCategory",
  mappableDataSuggestionProducer
);
const selectActivitymodelSuggestions = makeSelectSearchSuggestions(
  "activityModel",
  mappableDataSuggestionProducer
);
const selectSitesSuggestions = makeSelectSearchSuggestions(
  "site",
  mappableDataSuggestionProducer
);
const selectProductsSuggestions = makeSelectSearchSuggestions(
  "product",
  mappableDataSuggestionProducer
);
const selectOwnersSuggestions = makeSelectSearchSuggestions(
  "owner",
  mappableDataSuggestionProducer
);
const selectWritersSuggestions = makeSelectSearchSuggestions(
  "writer",
  mappableDataSuggestionProducer
);
const selectTagsSuggestions = makeSelectSearchSuggestions("tags", tags => {
  if (tags.triedInput === null) {
    return [""];
  }
  if (tags.value == null) {
    return tags.triedInput.split(";");
  }
  return tags.entityName.split(",");
});
const selectComputeMethodsSuggestions = makeSelectSearchSuggestions(
  "computeMethod",
  computeMethod => {
    if (computeMethod == null) {
      return [""];
    }
    if (isStandard(computeMethod)) {
      return [computeMethod.name];
    }
    if (computeMethod.type === ComputeMethodType.DEPRECATED_EMISSION_FACTOR) {
      return [t("entry.computeMethod.createEmissionFactor")];
    }
    if (computeMethod.type === ComputeMethodType.RAW_DATA) {
      return [t("entry.computeMethod.insertRawData")];
    }
    return [""];
  }
);
const selectEmissionFactorSuggestion = makeSelectSearchSuggestions(
  "emissionFactor",
  emissionFactor => {
    if (emissionFactor == null) {
      return [""];
    }
    return [emissionFactor.name];
  }
);

const selectSearchSuggestions: {
  [entryDataKey in EntryDataKey]?: typeof selectCategoriesSuggestions;
} = {
  activityCategory: selectCategoriesSuggestions,
  activityModel: selectActivitymodelSuggestions,
  site: selectSitesSuggestions,
  product: selectProductsSuggestions,
  owner: selectOwnersSuggestions,
  writer: selectWritersSuggestions,
  tags: selectTagsSuggestions,
  computeMethod: selectComputeMethodsSuggestions,
  emissionFactor: selectEmissionFactorSuggestion,
  commentary: makeSelectSearchSuggestions(
    "commentary",
    basicInputSuggestionProducer
  ),
  input1: makeSelectSearchSuggestions("input1", basicInputSuggestionProducer),
  input2: makeSelectSearchSuggestions("input2", basicInputSuggestionProducer),
  input1Unit: makeSelectSearchSuggestions(
    "input1Unit",
    basicInputSuggestionProducer
  ),
  input2Unit: makeSelectSearchSuggestions(
    "input2Unit",
    basicInputSuggestionProducer
  ),
  inputInstruction: makeSelectSearchSuggestions(
    "inputInstruction",
    basicInputSuggestionProducer
  ),
  source: makeSelectSearchSuggestions("source", basicInputSuggestionProducer),
};

export default selectSearchSuggestions;
