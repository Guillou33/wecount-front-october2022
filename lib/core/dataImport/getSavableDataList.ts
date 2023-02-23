import { EntryData } from "@reducers/dataImport/entryDataReducer";
import { DEFAULT_UNCERTAINTY } from "@custom-types/core/Uncertainty";
import { ComputeMethodType } from "@custom-types/core/ComputeMethodType";

import { isNonStandard, isStandard } from "./computeMethod";

export type EntryMetadata = {
  fileName?: string;
  importTimestamp?: number;
};

export type SavableData = {
  activityModelId: number;
  siteId: number | null;
  productId: number | null;
  ownerId: number | null;
  writerId: number | null;
  computeMethodType: ComputeMethodType;
  computeMethodId: number | null;
  emissionFactorId: number | null;
  value: number | null;
  value2: number | null;
  description: string | null;
  dataSource: string | null;
  manualTco2: number | null | undefined;
  manualUnitNumber: number | null | undefined;
  uncertainty: number;
  tags: number[];
  instruction: string | null;
  metadata?: EntryMetadata;
};

function entryDataToSavableData({
  activityModel,
  computeMethod,
  emissionFactor,
  ...restData
}: EntryData): SavableData | null {
  const activityModelId = activityModel.value;
  const emissionFactorId = emissionFactor?.id ?? null;
  if (
    activityModelId != null &&
    computeMethod != null &&
    (isNonStandard(computeMethod) || emissionFactorId != null)
  ) {
    const value = isStandard(computeMethod) ? restData.input1 : null;
    const value2 = isStandard(computeMethod) ? restData.input2 : null;

    const manualTco2 = isNonStandard(computeMethod) ? restData.input1 : null;
    // ManualUnitNumber is only used to modify old DEPRECATED_EMISSION_FATOR compute methods
    const manualUnitNumber = null;

    const tags = restData.tags.value?.filter(tag => tag != null) ?? [];

    return {
      activityModelId,
      computeMethodType: computeMethod.type,
      computeMethodId: isStandard(computeMethod) ? computeMethod.id : null,
      emissionFactorId,
      siteId: restData.site.value ?? null,
      productId: restData.product.value ?? null,
      tags,
      dataSource: restData.source,
      description: restData.commentary,
      ownerId: restData.owner.value ?? null,
      writerId: restData.writer.value ?? null,
      instruction: restData.inputInstruction,
      uncertainty: DEFAULT_UNCERTAINTY,
      value,
      value2,
      manualTco2,
      manualUnitNumber,
    };
  }
  return null;
}

function getSavableDatalist(
  entryDataList: EntryData[],
  metadata?: EntryMetadata
): SavableData[] {
  return entryDataList.reduce((result: SavableData[], entryData) => {
    const savableData = entryDataToSavableData(entryData);
    if (savableData != null) {
      if (metadata != null) {
        savableData.metadata = metadata;
      }
      result.push(savableData);
    }
    return result;
  }, []);
}

export default getSavableDatalist;
