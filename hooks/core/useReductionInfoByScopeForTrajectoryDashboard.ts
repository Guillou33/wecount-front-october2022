import useReductionInfoByCategory from "@hooks/core/useReductionInfoByCategory";
import {
    ReductionInfoByCategory,
    ReductionInfo,
} from "@hooks/core/helpers/getReductionInfoByCategory";
import { memoize } from "lodash";
import { Scope } from "@custom-types/wecount-api/activity";
import useCategoryInfo, { CategoryInfo } from "@hooks/core/useCategoryInfo";
import { ReductionInfoByActivityModel } from "./helpers/getReductionInfoByActivityModel";
import useActivityModelInfo, { ActivityModelInfo } from "./useActivityModelInfo";
import _ from "lodash";
import useReductionInfoByCategoryForTrajectoryDashboard from "./useReductionInfoByCategoryForTrajectoryDashboard";
import useReductionInfoByActivityModelForTrajectoryDashboard from "./useReductionInfoByActivityModelForTrajectoryDashboard";

export type ReductionInfoByScope = {
    [scope in Scope]: ReductionInfo;
};

function getReductionInfoForScope(
    reductionInfoByCategory: ReductionInfoByCategory,
    reductionInfoByActivityModel: ReductionInfoByActivityModel,
    categoryInfo: CategoryInfo,
    activityModelInfo: ActivityModelInfo,
    scope: Scope
): ReductionInfo {

    const reductionInfoInCategory = Object.entries(reductionInfoByCategory)
        .filter(
            ([categoryId]) => categoryInfo?.[Number(categoryId)].scope === scope
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

function getReductionInfoByScope(
    reductionInfoByCategory: ReductionInfoByCategory,
    reductionInfoByActivityModel: ReductionInfoByActivityModel,
    categoryInfo: CategoryInfo,
    activityModelInfo: ActivityModelInfo
): ReductionInfoByScope {
    return {
        [Scope.UPSTREAM]: getReductionInfoForScope(
            reductionInfoByCategory,
            reductionInfoByActivityModel,
            categoryInfo,
            activityModelInfo,
            Scope.UPSTREAM
        ),
        [Scope.CORE]: getReductionInfoForScope(
            reductionInfoByCategory,
            reductionInfoByActivityModel,
            categoryInfo,
            activityModelInfo,
            Scope.CORE
        ),
        [Scope.DOWNSTREAM]: getReductionInfoForScope(
            reductionInfoByCategory,
            reductionInfoByActivityModel,
            categoryInfo,
            activityModelInfo,
            Scope.DOWNSTREAM
        ),
    };
}

const memoizedReductionInfoByScope = memoize(getReductionInfoByScope);

function useReductionInfoTotal(trajectoryId: number) {
    const reductionInfoByCategory = useReductionInfoByCategoryForTrajectoryDashboard(trajectoryId);
    const reductionInfoByActivityModel = useReductionInfoByActivityModelForTrajectoryDashboard(trajectoryId);
    const categoryInfo = useCategoryInfo();
    const activityModelInfo = useActivityModelInfo();

    return memoizedReductionInfoByScope(
        reductionInfoByCategory,
        reductionInfoByActivityModel,
        categoryInfo,
        activityModelInfo,
    );
}

export default useReductionInfoTotal;
