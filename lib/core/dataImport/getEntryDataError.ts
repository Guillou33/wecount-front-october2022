import { ColumnName } from "@lib/core/dataImport/columnConfig";
import { EntryData } from "@reducers/dataImport/entryDataReducer";
import { EmissionFactorState } from "@reducers/core/emissionFactorReducer";

import { isStandard } from "./computeMethod";
import { isMappingFailed } from "./mappableData";
import getCoreEmissionFactor from "./getCoreEmissionFactor";

function getErrorsForCartographyAssociation(
  entryData: EntryData
): ColumnName[] {
  const { activityCategory, activityModel } = entryData;
  const errorsOnColumns: ColumnName[] = [];

  if (activityCategory.value == null) {
    errorsOnColumns.push(ColumnName.CATEGORY);
  }
  if (activityCategory.value != null && activityModel.value == null) {
    errorsOnColumns.push(ColumnName.ACTIVITY_MODEL);
  }
  return errorsOnColumns;
}

function getErrorsForCompletion(
  entryData: EntryData,
  emissionFactorMapping: EmissionFactorState["mapping"]
): ColumnName[] {
  const {
    site,
    product,
    tags,
    computeMethod,
    emissionFactor,
    writer,
    owner,
  } = entryData;
  const errorsOnColumns: ColumnName[] = [];

  if (isMappingFailed(site)) {
    errorsOnColumns.push(ColumnName.SITE);
  }
  if (isMappingFailed(product)) {
    errorsOnColumns.push(ColumnName.PRODUCT);
  }
  if (isMappingFailed(tags)) {
    errorsOnColumns.push(ColumnName.TAGS);
  }
  if (computeMethod == null) {
    errorsOnColumns.push(ColumnName.COMPUTE_METHOD);
  }
  if (
    computeMethod != null &&
    isStandard(computeMethod) &&
    emissionFactor?.id == null
  ) {
    errorsOnColumns.push(ColumnName.EMISSION_FACTOR);
  }
  if (isMappingFailed(owner)) {
    errorsOnColumns.push(ColumnName.OWNER);
  }
  if (isMappingFailed(writer)) {
    errorsOnColumns.push(ColumnName.WRITER);
  }

  const coreEmissionFactor = getCoreEmissionFactor(
    entryData,
    emissionFactorMapping
  );
  if (coreEmissionFactor != null) {
    if (
      coreEmissionFactor.input1Unit != null &&
      coreEmissionFactor.input1Unit !== entryData.input1Unit
    ) {
      errorsOnColumns.push(ColumnName.INPUT_1_UNIT);
    }
    if (
      coreEmissionFactor.input2Unit != null &&
      coreEmissionFactor.input2Unit !== entryData.input2Unit
    ) {
      errorsOnColumns.push(ColumnName.INPUT_2_UNIT);
    }
  }
  return errorsOnColumns;
}

export { getErrorsForCartographyAssociation, getErrorsForCompletion };
