import {
  ReductionInfoByCategory,
  ReductionInfo,
} from "@hooks/core/helpers/getReductionInfoByCategory";
import { memoize } from "lodash";
import useCategoryInfo, { CategoryInfo } from "@hooks/core/useCategoryInfo";
import { ReductionInfoByActivityModel } from "./helpers/getReductionInfoByActivityModel";
import { CategoryProjectionPossibleView } from "@reducers/trajectory/currentTrajectory/currentTrajectoryReducer";
import useCategoriesLevelDefinition from "./useCategoriesLevelDefinition";
import { ProjectionViewItem } from "@custom-types/core/TrajectoryTabItems";
import useReductionInfoByCategoryForTrajectoryDashboard from "./useReductionInfoByCategoryForTrajectoryDashboard";
import useReductionInfoByActivityModelForTrajectoryDashboard from "./useReductionInfoByActivityModelForTrajectoryDashboard";

import _ from "lodash";

function sumReductionInfo(
  a: ReductionInfo | undefined,
  b: ReductionInfo | undefined
): ReductionInfo {
  return {
    reductionTco2: (a?.reductionTco2 ?? 0) + (b?.reductionTco2 ?? 0),
    reductionPercentageOfScope:
      (a?.reductionPercentageOfScope ?? 0) +
      (b?.reductionPercentageOfScope ?? 0),
    reductionPercentageOfTotal:
      (a?.reductionPercentageOfTotal ?? 0) +
      (b?.reductionPercentageOfTotal ?? 0),
  };
}

function getReductionInfoByCategorySwitchDefinitionLevers(
  reductionInfoByCategory: ReductionInfoByCategory,
  reductionInfoByActivityModel: ReductionInfoByActivityModel,
  categoryInfo: CategoryInfo,
  categoriesLevelDefinition: CategoryProjectionPossibleView[]
): Record<number, ReductionInfo> {
  return (categoriesLevelDefinition ?? []).reduce(
    (acc, { categoryId, currentProjectionView }) => {
      if (currentProjectionView === ProjectionViewItem.CATEGORY) {
        acc[categoryId] = { ...reductionInfoByCategory[categoryId] };
        return acc;
      }

      const activityModelReduction = categoryInfo[
        categoryId
      ].activityModels.reduce((acc, activityModel) => {
        return sumReductionInfo(
          acc,
          reductionInfoByActivityModel[activityModel.id]
        );
      }, {} as ReductionInfo);

      acc[categoryId] = sumReductionInfo(
        acc[categoryId],
        activityModelReduction
      );
      return acc;
    },
    {} as Record<number, ReductionInfo>
  );
}

const memoizedReductionInfoByCategorySwitchDefinitionLevers = memoize(
  getReductionInfoByCategorySwitchDefinitionLevers
);

function useReductionInfoByCategoryForTrajectorySwitchDefinitionLevers(
  trajectoryId: number
) {
  const reductionInfoByCategory =
    useReductionInfoByCategoryForTrajectoryDashboard(trajectoryId);
  const reductionInfoByActivityModel =
    useReductionInfoByActivityModelForTrajectoryDashboard(trajectoryId);
  const categoryInfo = useCategoryInfo();

  // Get Level Definitions of Categories In Trajectory Projection Page ==> MAILLE DE DEFINITION DES LEVIERS
  const categoriesLevelDefinition = useCategoriesLevelDefinition(trajectoryId);

  return memoizedReductionInfoByCategorySwitchDefinitionLevers(
    reductionInfoByCategory,
    reductionInfoByActivityModel,
    categoryInfo,
    categoriesLevelDefinition
  );
}

export default useReductionInfoByCategoryForTrajectorySwitchDefinitionLevers;
