import useAllActivitiesNumberByActivityModel, { AllActivityInfoByActivityModel } from "@hooks/core/useAllActivityInfoByActivityModel";
import useCategoryInfo from "@hooks/core/useCategoryInfo";
import { ActivityCategory } from "@reducers/core/categoryReducer";
import { RootState } from "@reducers/index";
import { VisibleActivityModels } from "@reducers/userPreference/activityModelsReducer";
import { useMemo } from "react";
import { useSelector } from "react-redux";

export interface ActivityModelVisibilityInfo {
  activityModelTotal: number;
  activityModelVisible: number;
}

export interface ActivityModelVisibilityInfoByCategory {
  [key: number]: ActivityModelVisibilityInfo;
}

function useActivityModelVisibilityInfoByCategory(allActivitiesNumberByActivityModel?: AllActivityInfoByActivityModel): ActivityModelVisibilityInfoByCategory | null {
  const categoryInfo = useCategoryInfo();
  const visibleActivityModels = useSelector<
    RootState,
    VisibleActivityModels | null
  >(state => state.userPreference.activityModels.visibleActivityModels);
  // If we already have it, we do not call the use Effect again
  const allActivitiesNumberByActivityModelComputed = allActivitiesNumberByActivityModel ?? useAllActivitiesNumberByActivityModel();
  return useMemo(() => {
    if(visibleActivityModels == null){
      return null;
    }
    return Object.entries(categoryInfo).reduce(
      (
        acc: ActivityModelVisibilityInfoByCategory,
        [categoryId, activitycategory]: [string, ActivityCategory]
      ) => {
        const nonArchivedActivityModels = activitycategory.activityModels.filter( activityModel =>
          // Si l'activité est archivée, et qu'aucune donnée n'est présente, on ne la compte pas
          allActivitiesNumberByActivityModelComputed[activityModel.id]?.entriesNumber ||
           activityModel.archivedDate === null)
        acc[Number(categoryId)] = {
          activityModelTotal: nonArchivedActivityModels.length,
          activityModelVisible: nonArchivedActivityModels.reduce(
            (countVisible, activityModel) => {
              return visibleActivityModels[activityModel.uniqueName]
                ? countVisible + 1
                : countVisible;
            },
            0
          ),
        };
        return acc;
      },
      {}
    );
  }, [categoryInfo, visibleActivityModels, allActivitiesNumberByActivityModel]);
}

export default useActivityModelVisibilityInfoByCategory;
