import { ColumnName } from "@lib/core/dataImport/columnConfig";
import { EntryData } from "@reducers/dataImport/entryDataReducer";

import { ComputeMethod } from "./computeMethod";
import { EmissionFactorState } from "@reducers/core/emissionFactorReducer";
import { isStandard } from "./computeMethod";
import { ComputeMethodType } from "@custom-types/core/ComputeMethodType";

import { isMappingPartiallyFailed } from "./mappableData";

function getWarningsForCompletion(
  entryData: EntryData,
  emissionFactorMapping: EmissionFactorState["mapping"]
): ColumnName[] {
  const warningsOnColumns: ColumnName[] = [];
  const { tags, input1, input2, computeMethod, activityModel } = entryData;
  const activityModelId = activityModel.value;

  if (isMappingPartiallyFailed(tags)) {
    warningsOnColumns.push(ColumnName.TAGS);
  }

  if (computeMethod != null && input1 == null) {
    warningsOnColumns.push(ColumnName.INPUT_1);
  }

  if (
    computeMethod != null &&
    activityModelId != null &&
    input2Mismatch(
      computeMethodExpects2Input(
        computeMethod,
        activityModelId,
        emissionFactorMapping
      ),
      input2
    )
  ) {
    warningsOnColumns.push(ColumnName.INPUT_2);
  }
  return warningsOnColumns;
}

function computeMethodExpects2Input(
  computeMethodFromEntryData: ComputeMethod,
  activityModelFromEntryData: number,
  emissionFactorMapping: EmissionFactorState["mapping"]
): boolean {
  if (isStandard(computeMethodFromEntryData)) {
    const computeMethod =
      emissionFactorMapping[activityModelFromEntryData][
        computeMethodFromEntryData.id
      ];
    return computeMethod?.value2Name != null;
  }
  return false;
}

function input2Mismatch(
  computeMethodExpects2Input: boolean,
  input2: number | null
): boolean {
  return (
    (computeMethodExpects2Input && input2 == null) ||
    (!computeMethodExpects2Input && input2 != null)
  );
}

export { getWarningsForCompletion };
