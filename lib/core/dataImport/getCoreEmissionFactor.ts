import { EntryData } from "@reducers/dataImport/entryDataReducer";
import { EmissionFactorState } from "@reducers/core/emissionFactorReducer";
import { EmissionFactor } from "@reducers/entries/campaignEntriesReducer";

import { isStandard } from "./computeMethod";

function getCoreEmissionFactor(
  entryData: EntryData,
  emissionFactorMapping: EmissionFactorState["mapping"]
): EmissionFactor | null {
  const activityModelId = entryData.activityModel.value;
  const computeMethod = entryData.computeMethod;
  const computeMethodId =
    computeMethod != null && isStandard(computeMethod)
      ? computeMethod.id
      : null;
  const emissionFactorId = entryData.emissionFactor?.id;
  const emissionFactor =
    computeMethodId != null &&
    emissionFactorId != null &&
    activityModelId != null
      ? emissionFactorMapping?.[activityModelId]?.[
          computeMethodId
        ].emissionFactorMappings?.find(
          ef => ef.emissionFactor.id === emissionFactorId
        )?.emissionFactor ?? null
      : null;
  return emissionFactor;
}

export default getCoreEmissionFactor;
