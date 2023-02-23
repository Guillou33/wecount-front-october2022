import {
    ActionPlan,
    ActivityModelsActionPlan,
} from "@reducers/trajectory/campaignTrajectories/campaignTrajectoriesReducer";
import { getXPercentOf, percentageCalculator } from "@lib/utils/calculator";
import { Scope } from "@custom-types/wecount-api/activity";
import Memoize from "@lib/utils/Memoize";
import { ActivityModelInfo } from "../useActivityModelInfo";
import { EntryInfo } from "@lib/core/activityEntries/entryInfo";

export interface ReductionInfo {
    reductionTco2: number;
    reductionPercentageOfTotal: number;
    reductionPercentageOfScope: number;
}

export interface ActionPlanReductionInfo extends ReductionInfo {
    actionPlanId: string;
}

export interface CategoryReductionInfo extends ReductionInfo {
    actionPlansReductions: ActionPlansReductionsInfoById;
}

type ActionPlansReductionsInfoById = {
    [actionPlanId: string]: ActionPlanReductionInfo;
};

export type ReductionInfoByActivityModel = {
    [activityModelId: number]: CategoryReductionInfo;
};

type ScopePercentageCalculators = {
    [scope in Scope]: (number: number) => number;
};

function getActionPlanReductionInfo(
    actionPlan: ActionPlan,
    activityModelTco2: number,
    getPercentOfTotal: (number: number) => number,
    getPercentOfScope: (number: number) => number
): ActionPlanReductionInfo {
    const reductionTco2 = getXPercentOf(actionPlan.reduction, activityModelTco2);
    const reductionPercentageOfTotal = getPercentOfTotal(reductionTco2);
    const reductionPercentageOfScope = getPercentOfScope(reductionTco2);
    return {
        actionPlanId: actionPlan.id,
        reductionTco2,
        reductionPercentageOfTotal,
        reductionPercentageOfScope,
    };
}

function getActivityModelReductionInfo(
    actionPlans: ActionPlan[],
    activityModelTco2: number,
    getPercentageOfTotal: (number: number) => number,
    getPercentageOfScope: (number: number) => number
): CategoryReductionInfo {
    const actionPlansReductionsList = actionPlans.map(actionPlan =>
        getActionPlanReductionInfo(
            actionPlan,
            activityModelTco2,
            getPercentageOfTotal,
            getPercentageOfScope
        )
    );
    const actionPlansReductions = actionPlansReductionsList.reduce(
        (acc, actionPlan) => {
            acc[actionPlan.actionPlanId] = actionPlan;
            return acc;
        },
        {} as ActionPlansReductionsInfoById
    );
    const activityModelReduction = actionPlansReductionsList.reduce(
        (sum, actionPlanReduction) => {
            return sum + actionPlanReduction.reductionTco2;
        },
        0
    );

    return {
        reductionTco2: activityModelReduction,
        reductionPercentageOfTotal: getPercentageOfTotal(activityModelReduction),
        reductionPercentageOfScope: getPercentageOfScope(activityModelReduction),
        actionPlansReductions,
    };
}

function getScopesPercentagecalculator(
    scopeTotals: Record<Scope, EntryInfo>
): ScopePercentageCalculators {
    return {
        [Scope.UPSTREAM]: percentageCalculator(scopeTotals.UPSTREAM.tCo2),
        [Scope.CORE]: percentageCalculator(scopeTotals.CORE.tCo2),
        [Scope.DOWNSTREAM]: percentageCalculator(scopeTotals.DOWNSTREAM.tCo2),
    };
}

function getReductionTco2ByActivityModel(
    entryInfoByActivityModel: Record<number, EntryInfo>,
    activityModelActionPlan: ActivityModelsActionPlan,
    activityModelInfo: ActivityModelInfo,
    scopeTotals: Record<Scope, EntryInfo>,
) {
    const campaignTco2 =
        scopeTotals.UPSTREAM.tCo2 +
        scopeTotals.CORE.tCo2 +
        scopeTotals.DOWNSTREAM.tCo2;

    const scopePercentageCalculators = getScopesPercentagecalculator(scopeTotals);
    const getPercentageOfTotal = percentageCalculator(campaignTco2);

    const reductionInfo: { [activityModelId: string]: CategoryReductionInfo } = {};

    for (let activityModelId in entryInfoByActivityModel) {
        const categoryId = activityModelInfo[activityModelId].category.id;
        const activityModelScope = activityModelInfo[activityModelId].category.scope;
        const { tCo2: activityModelTco2 } = entryInfoByActivityModel[activityModelId];

        const actionPlans = activityModelActionPlan[categoryId] === undefined ? [] :
            activityModelActionPlan[categoryId].filter(activityModel => activityModel[activityModelId])[0] === undefined ? [] :
                activityModelActionPlan[categoryId].filter(activityModel => activityModel[activityModelId])[0][activityModelId] === undefined ? [] :
                    activityModelActionPlan[categoryId].filter(activityModel => activityModel[activityModelId])[0][activityModelId];

        reductionInfo[activityModelId] = getActivityModelReductionInfo(
            actionPlans,
            activityModelTco2,
            getPercentageOfTotal,
            scopePercentageCalculators[activityModelScope]
        );
    }
    return reductionInfo;
}

const memoizedCategoriesReductionTco2 = new Memoize(getReductionTco2ByActivityModel);

export function getMemoizedReductionTco2ByActivityModel(
    entryInfoByActivityModel: Record<number, EntryInfo>,
    activityModelActionPlan: ActivityModelsActionPlan,
    activityModelInfo: ActivityModelInfo,
    scopeTotals: Record<Scope, EntryInfo>
) {
    return memoizedCategoriesReductionTco2.execute(
        entryInfoByActivityModel,
        activityModelActionPlan,
        activityModelInfo,
        scopeTotals
    );
}
