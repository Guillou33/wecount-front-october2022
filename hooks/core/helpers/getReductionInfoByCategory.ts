import {
  ActionPlan,
  CategoriesActionPlan,
} from "@reducers/trajectory/campaignTrajectories/campaignTrajectoriesReducer";
import { getXPercentOf, percentageCalculator } from "@lib/utils/calculator";
import { CategoryInfo } from "@hooks/core/useCategoryInfo";
import { Scope } from "@custom-types/wecount-api/activity";
import { EntryInfo } from "@lib/core/activityEntries/entryInfo";
import Memoize from "@lib/utils/Memoize";
import { ActivityInfo } from "./activityInfo";

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

export type ReductionInfoByCategory = {
  [categoryId: number]: CategoryReductionInfo;
};

type ScopePercentageCalculators = {
  [scope in Scope]: (number: number) => number;
};

function getActionPlanReductionInfo(
  actionPlan: ActionPlan,
  categoryTco2: number,
  getPercentOfTotal: (number: number) => number,
  getPercentOfScope: (number: number) => number
): ActionPlanReductionInfo {
  const reductionTco2 = getXPercentOf(actionPlan.reduction, categoryTco2);
  const reductionPercentageOfTotal = getPercentOfTotal(reductionTco2);
  const reductionPercentageOfScope = getPercentOfScope(reductionTco2);
  return {
    actionPlanId: actionPlan.id,
    reductionTco2,
    reductionPercentageOfTotal,
    reductionPercentageOfScope,
  };
}

function getCategoryReductionInfo(
  actionPlans: ActionPlan[],
  categoryTco2: number,
  getPercentageOfTotal: (number: number) => number,
  getPercentageOfScope: (number: number) => number
): CategoryReductionInfo {
  const actionPlansReductionsList = actionPlans.map(actionPlan =>
    getActionPlanReductionInfo(
      actionPlan,
      categoryTco2,
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
  const categoryReduction = actionPlansReductionsList.reduce(
    (sum, actionPlanReduction) => {
      return sum + actionPlanReduction.reductionTco2;
    },
    0
  );

  return {
    reductionTco2: categoryReduction,
    reductionPercentageOfTotal: getPercentageOfTotal(categoryReduction),
    reductionPercentageOfScope: getPercentageOfScope(categoryReduction),
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

function getReductionTco2ByCategory(
  entryInfoByCategory: Record<number, EntryInfo>,
  categoriesActionPlan: CategoriesActionPlan,
  categoryInfo: CategoryInfo,
  scopeTotals: Record<Scope, EntryInfo>,
) {
  const campaignTco2 =
    scopeTotals.UPSTREAM.tCo2 +
    scopeTotals.CORE.tCo2 +
    scopeTotals.DOWNSTREAM.tCo2;

  const scopePercentageCalculators = getScopesPercentagecalculator(scopeTotals);
  const getPercentageOfTotal = percentageCalculator(campaignTco2);

  const reductionInfo: { [categoryId: string]: CategoryReductionInfo } = {};

  for (let categoryId in entryInfoByCategory) {
    const categoryScope = categoryInfo[categoryId].scope;
    const { tCo2: categoryTco2 } = entryInfoByCategory[categoryId];
    const actionPlans = categoriesActionPlan[categoryId] ?? [];

    reductionInfo[categoryId] = getCategoryReductionInfo(
      actionPlans,
      categoryTco2,
      getPercentageOfTotal,
      scopePercentageCalculators[categoryScope]
    );
  }
  return reductionInfo;
}

const memoizedCategoriesReductionTco2 = new Memoize(getReductionTco2ByCategory);

export function getMemoizedReductionTco2ByCategory(
  entryInfoByCategory: Record<number, EntryInfo>,
  categoriesActionPlan: CategoriesActionPlan,
  categoryInfo: CategoryInfo,
  scopeTotals: Record<Scope, EntryInfo>
) {
  return memoizedCategoriesReductionTco2.execute(
    entryInfoByCategory,
    categoriesActionPlan,
    categoryInfo,
    scopeTotals
  );
}
