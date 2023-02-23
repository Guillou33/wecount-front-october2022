import { UserPreferencesActivityCategoryResponse } from "@lib/wecount-api/responses/apiResponses";
import { ActivityCategoriesPreferencesType } from "@actions/userPreference/activityCategories/types";
import { Action } from "@actions/userPreference/activityCategories/activityCategoriesAction";
import immer from "immer";

export interface ActivityCategoryPreferencesState {
  [categoryId: number]: UserPreferencesActivityCategoryResponse;
}

const initialState: ActivityCategoryPreferencesState = {};

function reducer(
  state: ActivityCategoryPreferencesState = initialState,
  action: Action
): ActivityCategoryPreferencesState {
  switch (action.type) {
    case ActivityCategoriesPreferencesType.SET_ALL_ACTIVITY_CATEGORIES_PREFERENCES: {
      return action.payload.reduce((acc, categoryPreference) => {
        acc[categoryPreference.activityCategoryId] = { ...categoryPreference };
        return acc;
      }, {} as ActivityCategoryPreferencesState);
    }

    case ActivityCategoriesPreferencesType.ACTIVITY_CATEGORY_PREFERENCE_UPDATE_DESCRIPTION: {
      const { activityCategoryId, description } = action.payload;
      const previous = state[activityCategoryId] ?? {};

      return {
        ...state,
        [activityCategoryId]: {
          ...previous,
          activityCategoryId,
          description,
        },
      };
    }

    case ActivityCategoriesPreferencesType.ACTIVITY_CATEGORY_PREFERENCE_UPDATE_ORDERS: {
      return immer(state, draft => {
        action.payload.categorySettings.forEach(({ activityCategoryId, order }) => {
          draft[activityCategoryId].order = order;
        });
      });
    }

    case ActivityCategoriesPreferencesType.RESET_CATEGORY_PREFERENCES_STATE:
      return initialState;

    default:
      return state;
  }
}

export default reducer;
