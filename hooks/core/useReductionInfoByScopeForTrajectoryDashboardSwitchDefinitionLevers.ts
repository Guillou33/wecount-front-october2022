import {
  ReductionInfoByCategory,
  ReductionInfo,
} from "@hooks/core/helpers/getReductionInfoByCategory";
import { memoize } from "lodash";
import { Scope } from "@custom-types/wecount-api/activity";
import useCategoryInfo, { CategoryInfo } from "@hooks/core/useCategoryInfo";
import { ReductionInfoByActivityModel } from "./helpers/getReductionInfoByActivityModel";
import useActivityModelInfo, {
  ActivityModelInfo,
} from "./useActivityModelInfo";
import { CategoryProjectionPossibleView } from "@reducers/trajectory/currentTrajectory/currentTrajectoryReducer";
import useCategoriesLevelDefinition from "./useCategoriesLevelDefinition";
import { ProjectionViewItem } from "@custom-types/core/TrajectoryTabItems";
import useReductionInfoByCategoryForTrajectoryDashboard from "./useReductionInfoByCategoryForTrajectoryDashboard";
import useReductionInfoByActivityModelForTrajectoryDashboard from "./useReductionInfoByActivityModelForTrajectoryDashboard";

import _ from "lodash";

export type ReductionInfoByScope = {
  [scope in Scope]: ReductionInfo;
};

function getReductionInfoForScopeSwitchDefinitionLevers(
  reductionInfoByCategory: ReductionInfoByCategory,
  reductionInfoByActivityModel: ReductionInfoByActivityModel,
  categoryInfo: CategoryInfo,
  activityModelInfo: ActivityModelInfo,
  scope: Scope,
  categoriesLevelDefinition: CategoryProjectionPossibleView[]
): ReductionInfo {
  const reductionInfoInCategory =
    categoriesLevelDefinition !== undefined
      ? Object.entries(reductionInfoByCategory)
          .filter(
            ([categoryId]) => categoryInfo?.[Number(categoryId)].scope === scope
          )
          .filter(([categoryId]) =>
            categoriesLevelDefinition
              .filter(
                level =>
                  level.currentProjectionView !==
                  ProjectionViewItem.ACTIVITY_MODELS
              )
              .map(level => level.categoryId)
              .includes(Number(categoryId))
          )
          .reduce(
            (acc, [_, categoryReductionInfo]) => {
              const {
                reductionTco2,
                reductionPercentageOfTotal,
                reductionPercentageOfScope,
              } = categoryReductionInfo;

              acc.reductionTco2 += reductionTco2;
              acc.reductionPercentageOfTotal += reductionPercentageOfTotal;
              acc.reductionPercentageOfScope += reductionPercentageOfScope;
              return acc;
            },
            {
              reductionTco2: 0,
              reductionPercentageOfTotal: 0,
              reductionPercentageOfScope: 0,
            }
          )
      : {
          reductionTco2: 0,
          reductionPercentageOfTotal: 0,
          reductionPercentageOfScope: 0,
        };
  const reductionInfoInActivityModel =
    categoriesLevelDefinition !== undefined
      ? Object.entries(reductionInfoByActivityModel)
          .filter(
            ([activityModelId]) =>
              activityModelInfo?.[Number(activityModelId)].category.scope ===
              scope
          )
          .filter(([activityModelId]) =>
            categoriesLevelDefinition
              .filter(
                level =>
                  level.currentProjectionView ===
                  ProjectionViewItem.ACTIVITY_MODELS
              )
              .map(level => level.categoryId)
              .includes(
                activityModelInfo?.[Number(activityModelId)].category.id
              )
          )
          .reduce(
            (acc, [_, activityModelReductionInfo]) => {
              const {
                reductionTco2,
                reductionPercentageOfTotal,
                reductionPercentageOfScope,
              } = activityModelReductionInfo;

              acc.reductionTco2 += reductionTco2;
              acc.reductionPercentageOfTotal += reductionPercentageOfTotal;
              acc.reductionPercentageOfScope += reductionPercentageOfScope;
              return acc;
            },
            {
              reductionTco2: 0,
              reductionPercentageOfTotal: 0,
              reductionPercentageOfScope: 0,
            }
          )
      : {
          reductionTco2: 0,
          reductionPercentageOfTotal: 0,
          reductionPercentageOfScope: 0,
        };
  return {
    reductionTco2:
      reductionInfoInCategory.reductionTco2 +
      reductionInfoInActivityModel.reductionTco2,
    reductionPercentageOfTotal:
      reductionInfoInCategory.reductionPercentageOfTotal +
      reductionInfoInActivityModel.reductionPercentageOfTotal,
    reductionPercentageOfScope:
      reductionInfoInCategory.reductionPercentageOfScope +
      reductionInfoInActivityModel.reductionPercentageOfScope,
  };
}

function getReductionInfoByScopeSwitchDefinitionLevers(
  reductionInfoByCategory: ReductionInfoByCategory,
  reductionInfoByActivityModel: ReductionInfoByActivityModel,
  categoryInfo: CategoryInfo,
  activityModelInfo: ActivityModelInfo,
  categoriesLevelDefinition: CategoryProjectionPossibleView[]
): ReductionInfoByScope {
  return {
    [Scope.UPSTREAM]: getReductionInfoForScopeSwitchDefinitionLevers(
      reductionInfoByCategory,
      reductionInfoByActivityModel,
      categoryInfo,
      activityModelInfo,
      Scope.UPSTREAM,
      categoriesLevelDefinition
    ),
    [Scope.CORE]: getReductionInfoForScopeSwitchDefinitionLevers(
      reductionInfoByCategory,
      reductionInfoByActivityModel,
      categoryInfo,
      activityModelInfo,
      Scope.CORE,
      categoriesLevelDefinition
    ),
    [Scope.DOWNSTREAM]: getReductionInfoForScopeSwitchDefinitionLevers(
      reductionInfoByCategory,
      reductionInfoByActivityModel,
      categoryInfo,
      activityModelInfo,
      Scope.DOWNSTREAM,
      categoriesLevelDefinition
    ),
  };
}

const memoizedReductionInfoByScopeSwitchDefinitionLevers = memoize(
  getReductionInfoByScopeSwitchDefinitionLevers
);

function useReductionInfoTotalSwitchDefinitionLevers(trajectoryId: number) {
  const reductionInfoByCategory =
    useReductionInfoByCategoryForTrajectoryDashboard(trajectoryId);
  const reductionInfoByActivityModel =
    useReductionInfoByActivityModelForTrajectoryDashboard(trajectoryId);
  const categoryInfo = useCategoryInfo();
  const activityModelInfo = useActivityModelInfo();

  // Get Level Definitions of Categories In Trajectory Projection Page ==> MAILLE DE DEFINITION DES LEVIERS
  const categoriesLevelDefinition = useCategoriesLevelDefinition(trajectoryId);

  return memoizedReductionInfoByScopeSwitchDefinitionLevers(
    reductionInfoByCategory,
    reductionInfoByActivityModel,
    categoryInfo,
    activityModelInfo,
    categoriesLevelDefinition
  );
}

export default useReductionInfoTotalSwitchDefinitionLevers;
