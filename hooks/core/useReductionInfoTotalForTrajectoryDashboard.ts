import useReductionInfoByCategory from "@hooks/core/useReductionInfoByCategory";
import {
    ReductionInfoByCategory,
    ReductionInfo,
} from "@hooks/core/helpers/getReductionInfoByCategory";
import { memoize } from "lodash";
import { Scope } from "@custom-types/wecount-api/activity";
import useCategoryInfo, { CategoryInfo } from "@hooks/core/useCategoryInfo";
import useReductionInfoByActivityModel from "./useReductionInfoByActivityModel";
import { ReductionInfoByActivityModel } from "./helpers/getReductionInfoByActivityModel";
import useActivityModelInfo, { ActivityModelInfo } from "./useActivityModelInfo";
import { CategoryProjectionPossibleView } from "@reducers/trajectory/currentTrajectory/currentTrajectoryReducer";
import useCategoriesLevelDefinition from "./useCategoriesLevelDefinition";
import { ProjectionViewItem } from "@components/campaign/detail/trajectory/helpers/TrajectoryTabItems";
import _ from "lodash";

export type ReductionInfoByScope = {
    [scope in Scope]: ReductionInfo;
};

function getReductionInfoForScopeForTrajectoryDashboard(
    reductionInfoByCategory: ReductionInfoByCategory,
    reductionInfoByActivityModel: ReductionInfoByActivityModel,
    categoryInfo: CategoryInfo,
    activityModelInfo: ActivityModelInfo,
    scope: Scope,
    categoriesLevelDefinition: CategoryProjectionPossibleView[]
): ReductionInfo {

    const reductionInfoInCategory = Object.entries(reductionInfoByCategory)
        .filter(
            ([categoryId]) => categoryInfo?.[Number(categoryId)].scope === scope
        )
        .filter(([categoryId]) => categoriesLevelDefinition
            .filter(level => level.currentProjectionView !== ProjectionViewItem.ACTIVITY_MODELS)
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
        );
    const reductionInfoInActivityModel = Object.entries(reductionInfoByActivityModel)
        .filter(
            ([activityModelId]) => activityModelInfo?.[Number(activityModelId)].category.scope === scope
        )
        .filter(([activityModelId]) => categoriesLevelDefinition
            .filter(level => level.currentProjectionView === ProjectionViewItem.ACTIVITY_MODELS)
            .map(level => level.categoryId)
            .includes(activityModelInfo?.[Number(activityModelId)].category.id)
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
        );
    return {
        reductionTco2: reductionInfoInCategory.reductionTco2 + reductionInfoInActivityModel.reductionTco2,
        reductionPercentageOfTotal: reductionInfoInCategory.reductionPercentageOfTotal + reductionInfoInActivityModel.reductionPercentageOfTotal,
        reductionPercentageOfScope: reductionInfoInCategory.reductionPercentageOfScope + reductionInfoInActivityModel.reductionPercentageOfScope,
    };
}

function getReductionInfoTotalForTrajectoryDashboard(
    reductionInfoByCategory: ReductionInfoByCategory,
    reductionInfoByActivityModel: ReductionInfoByActivityModel,
    categoryInfo: CategoryInfo,
    activityModelInfo: ActivityModelInfo,
    categoriesLevelDefinition: CategoryProjectionPossibleView[]
): ReductionInfoByScope {
    return {
        [Scope.UPSTREAM]: getReductionInfoForScopeForTrajectoryDashboard(
            reductionInfoByCategory,
            reductionInfoByActivityModel,
            categoryInfo,
            activityModelInfo,
            Scope.UPSTREAM,
            categoriesLevelDefinition
        ),
        [Scope.CORE]: getReductionInfoForScopeForTrajectoryDashboard(
            reductionInfoByCategory,
            reductionInfoByActivityModel,
            categoryInfo,
            activityModelInfo,
            Scope.CORE,
            categoriesLevelDefinition
        ),
        [Scope.DOWNSTREAM]: getReductionInfoForScopeForTrajectoryDashboard(
            reductionInfoByCategory,
            reductionInfoByActivityModel,
            categoryInfo,
            activityModelInfo,
            Scope.DOWNSTREAM,
            categoriesLevelDefinition
        ),
    };
}

const memoizedReductionInfoTotalForTrajectoryDashboard = memoize(getReductionInfoTotalForTrajectoryDashboard);

function useReductionInfoTotalForTrajectoryDashboard(trajectoryId: number) {
    const reductionInfoByCategory = useReductionInfoByCategory(trajectoryId);
    const reductionInfoByActivityModel = useReductionInfoByActivityModel(trajectoryId);
    const categoryInfo = useCategoryInfo();
    const activityModelInfo = useActivityModelInfo();

    // Get Level Definitions of Categories In Trajectory Projection Page ==> MAILLE DE DEFINITION DES LEVIERS
    const categoriesLevelDefinition = useCategoriesLevelDefinition(trajectoryId);

    return memoizedReductionInfoTotalForTrajectoryDashboard(
        reductionInfoByCategory,
        reductionInfoByActivityModel,
        categoryInfo,
        activityModelInfo,
        categoriesLevelDefinition
    );
}

export default useReductionInfoTotalForTrajectoryDashboard;
