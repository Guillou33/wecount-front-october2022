import { useSelector } from "react-redux";
import { useMemo } from "react";
import { RootState } from "@reducers/index";
import { VisibleActivityModels } from "@reducers/userPreference/activityModelsReducer";
import useActivityModelInfoByUniqueName from "@hooks/core/useActivityModelInfoByUniqueName";

export type VisibleActivityModelIds = {
  [key: number]: boolean;
};

function useVisibleActivityModelIds(): VisibleActivityModelIds | null {
  const visibleActivityModels = useSelector<
    RootState,
    VisibleActivityModels | null
  >(state => state.userPreference.activityModels.visibleActivityModels);

  const activityModelInfo = useActivityModelInfoByUniqueName();
  const visibleActivityModelIds = useMemo(() => {
    if (visibleActivityModels == null) {
      return null;
    }
    return Object.entries(visibleActivityModels).reduce(
      (
        acc: VisibleActivityModelIds,
        [uniqueName, visibility]: [string, boolean]
      ) => {
        const activityModel = activityModelInfo[uniqueName];
        if (activityModel != null) {
          acc[activityModel.id] = visibility;
        }
        return acc;
      },
      {}
    );
  }, [visibleActivityModels, activityModelInfo]);
  return visibleActivityModelIds;
}

export default useVisibleActivityModelIds;
