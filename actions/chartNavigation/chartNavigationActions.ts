import { ChartNavigationTypes } from "@actions/chartNavigation/types";
import { ChartView } from "@reducers/chartNavigationReducer";
import { Scope } from "@custom-types/wecount-api/activity";

export type Action = PushView | GoBackToView;

export interface PushView {
  type: ChartNavigationTypes.PUSH_VIEW;
  payload: ChartView;
}

interface GoBackToView {
  type: ChartNavigationTypes.GO_BACK_TO_VIEW;
  payload: number;
}

export function goBackToView(viewIndex: number): GoBackToView {
  return {
    type: ChartNavigationTypes.GO_BACK_TO_VIEW,
    payload: viewIndex,
  };
}

export function viewByScope(scope: Scope): PushView {
  return {
    type: ChartNavigationTypes.PUSH_VIEW,
    payload: {
      view: "SCOPE",
      scope,
    },
  };
}

export function viewByCategory(categoryId: number): PushView {
  return {
    type: ChartNavigationTypes.PUSH_VIEW,
    payload: {
      view: "CATEGORY",
      categoryId,
    },
  };
}

export function resetChartNavigation(): GoBackToView {
  return {
    type: ChartNavigationTypes.GO_BACK_TO_VIEW,
    payload: 0,
  };
}
