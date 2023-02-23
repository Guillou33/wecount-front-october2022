import { Scope } from "@custom-types/wecount-api/activity";
import { Action } from "@actions/chartNavigation/chartNavigationActions";
import { ChartNavigationTypes } from "@actions/chartNavigation/types";

export interface ChartNavigationState {
  navigationStack: ChartView[];
}

export type ChartView = GlobalView | ScopeView | CategoryView;

interface GlobalView {
  view: "GLOBAL";
}

interface ScopeView {
  view: "SCOPE";
  scope: Scope;
}

interface CategoryView {
  view: "CATEGORY";
  categoryId: number;
}

const initialState: ChartNavigationState = {
  navigationStack: [{ view: "GLOBAL" }],
};

const reducer = (
  state: ChartNavigationState = initialState,
  action: Action
): ChartNavigationState => {
  switch (action.type) {
    case ChartNavigationTypes.PUSH_VIEW:
      return {
        ...state,
        navigationStack: [...state.navigationStack, action.payload],
      };
    case ChartNavigationTypes.GO_BACK_TO_VIEW:
      return {
        ...state,
        navigationStack: state.navigationStack.slice(0, action.payload + 1),
      };
    default:
      return state;
  }
};

export default reducer;
