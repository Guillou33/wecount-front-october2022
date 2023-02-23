import { useSelector } from "react-redux";
import { useEffect } from "react";

import { RootState } from "@reducers/index";
import {
  ComputeMethod,
  ComputeMethodMapping,
} from "@reducers/core/emissionFactorReducer";
import { ComputeMethodType } from "@custom-types/core/ComputeMethodType";

import { EntryData } from "@reducers/entries/campaignEntriesReducer";
import { ActivityModelWithCategory } from "@hooks/core/useActivityModelInfo";

export type ComputeMethodData = {
  computeMethodType: ComputeMethodType;
  computeMethodId?: number;
};

function useComputeMethodSetup({
  entry,
  activityModel,
  onComputeMethodSetup,
}: {
  entry: EntryData;
  activityModel: ActivityModelWithCategory;
  onComputeMethodSetup: (computeMethodData: ComputeMethodData) => void;
}) {
  const computeMethods = useSelector<
    RootState,
    ComputeMethodMapping | undefined
  >(state =>
    activityModel == null
      ? undefined
      : state.core.emissionFactor.mapping[activityModel.id]
  );
  const currentComputeMethodId = entry.computeMethodId;
  const currentComputeMethodType = entry.computeMethodType;

  useEffect(() => {
    if (computeMethods == null) {
      return;
    }
    if (
      !currentComputeMethodType ||
      (currentComputeMethodType === ComputeMethodType.STANDARD &&
        (currentComputeMethodId === null ||
          typeof currentComputeMethodId === "undefined"))
    ) {
      let currentComputeMethodTypeToSet: ComputeMethodType;
      let currentComputeMethodToSet: ComputeMethod | null = null;
      if (activityModel.onlyManual) {
        currentComputeMethodTypeToSet = ComputeMethodType.RAW_DATA;
      } else {
        currentComputeMethodTypeToSet = ComputeMethodType.STANDARD;
        currentComputeMethodToSet =
          Object.values(computeMethods).find(
            (cm: ComputeMethod) => cm.isDefault
          ) || (Object.values(computeMethods)[0] as ComputeMethod);
      }
      onComputeMethodSetup({
        computeMethodType: currentComputeMethodTypeToSet,
        computeMethodId: currentComputeMethodToSet?.id,
      });
    }
  });
}

export default useComputeMethodSetup;
