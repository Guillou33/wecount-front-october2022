import {
  CategoryTypes,
} from "@actions/core/category/types";
import { ActivityCategoriesResponse, PossibleAction } from '@lib/wecount-api/responses/apiResponses';
import { Action } from "@actions/core/category/categoryActions";
import { Scope } from '@custom-types/wecount-api/activity';

export interface ActivityCategory {
  scope: Scope;
  id: number;
  name: string;
  iconName: string | null;
  description: string | null;
  activityModels: ActivityModel[];
  possibleActions: PossibleAction[];
  actionPlanHelp: string | null;  
};
export interface ActivityModel {
  id: number;
  name: string;
  description: string | null;
  help: string | null;
  seeMore: string | null;
  helpIframe: string | null;
  seeMoreIframe: string | null;
  onlyManual: boolean;
  uniqueName: string;
  isPrivate: boolean;
  archivedDate: string | null;
  possibleActions: PossibleAction[];
};

export interface CategoryList {
  [Scope.UPSTREAM]: {
    [key: number]: ActivityCategory
  };
  [Scope.CORE]: {
    [key: number]: ActivityCategory
  };
  [Scope.DOWNSTREAM]: {
    [key: number]: ActivityCategory
  };
}

export interface CategoryState {
  categoryList: CategoryList,
  isSet: boolean,
}

/**
 * Initial reducer state
 * @type {Object}
 */
const INITIAL_STATE: CategoryState = {
  categoryList: {
    [Scope.UPSTREAM]: {},
    [Scope.CORE]: {},
    [Scope.DOWNSTREAM]: {},
  },
  isSet: false,
};

/**
 * Updates reducer state depending on action type
 * @param {Object} state - the reducer state
 * @param {Object} action - the fired action object
 * @param {string} action.type - the action type
 * @param {?Object} action.payload - additional action data
 * @return {Object} new reducer state
 */

const reducer = (state: CategoryState = INITIAL_STATE, action: Action): CategoryState => {
  switch (action.type) {
    case CategoryTypes.SET_ACTIVITY_CATEGORIES:
      return {...state, categoryList: formatCategories(action.payload.activityCategories), isSet: action.payload.activityCategories.length > 0};
    default:
      return state;
  }
};

const formatCategories = (serverCategories: ActivityCategoriesResponse): CategoryList => {
  const categoryList: CategoryList = serverCategories.reduce((mapping: CategoryList, category) => {
    mapping[category.scope][category.id] = category;
    return mapping;
  }, {
    [Scope.UPSTREAM]: {},
    [Scope.CORE]: {},
    [Scope.DOWNSTREAM]: {},
  });

  return categoryList;
}

export default reducer;
