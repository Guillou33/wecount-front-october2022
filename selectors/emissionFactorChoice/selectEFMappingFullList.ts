import { createSelector } from "reselect";
import { RootState } from "@reducers/index";
import { EmissionFactorMapping } from "@reducers/core/emissionFactorReducer";

const selectEFMappingFullList = createSelector([
  (state: RootState) => state.emissionFactorChoice.currentDataInited,
  (state: RootState) => state.emissionFactorChoice.currentActivityModelId,
  (state: RootState) => state.emissionFactorChoice.currentComputeMethodId,
  (state: RootState) => state.emissionFactorChoice.currentEmissionFactor,
  (state: RootState) => state.core.emissionFactor.mapping,
], (currentDataInited, activityModelId, computeMethodId, emissionFactor, efm) => {
  if (!currentDataInited) {
    return [];
  }  
  const computeMethod = (!activityModelId || !computeMethodId)
    ? undefined
    : efm?.[activityModelId]?.[
      computeMethodId
    ];
  
  const availableEFMappings = !computeMethod
    ? []
    : computeMethod.emissionFactorMappings?.filter(
        (efm) =>
          !efm.emissionFactor.notVisible ||
          efm.emissionFactor.id === emissionFactor?.id
      ) ?? [];

  const currentEFMapping: EmissionFactorMapping | undefined = emissionFactor
    ? {
        recommended: false,
        emissionFactor: emissionFactor,
      }
    : undefined;

  const currentEFIsAvailable = !!availableEFMappings.find(
    (efm) => efm.emissionFactor.id === currentEFMapping?.emissionFactor?.id
  );
  const emissionFactorMappings =
    currentEFIsAvailable || !currentEFMapping
      ? availableEFMappings
      : [currentEFMapping, ...availableEFMappings];

  return emissionFactorMappings;
});

export default selectEFMappingFullList;
