import { ActivityCategoriesPreferencesType } from "./types";
import { UserPreferencesActivityCategoryResponse } from "@lib/wecount-api/responses/apiResponses";

export type PartialActivityCategoryPreferences = {
  activityCategoryId: number;
  order?: number;
  description?: string;
};

export type Action =
  | SetAllActivityCategoriesPreferences
  | ActivityCategoriesPreferencesRequested
  | UpdateDescription
  | UpdateOrders
  | SaveOrders
  | ResetCategoriesPreferencesState;

export interface SetAllActivityCategoriesPreferences {
  type: ActivityCategoriesPreferencesType.SET_ALL_ACTIVITY_CATEGORIES_PREFERENCES;
  payload: UserPreferencesActivityCategoryResponse[];
}

export interface ActivityCategoriesPreferencesRequested {
  type: ActivityCategoriesPreferencesType.ACTIVITY_CATEGORIES_PREFERENCES_REQUESTED;
  payload: number;
}

export interface UpdateDescription {
  type: ActivityCategoriesPreferencesType.ACTIVITY_CATEGORY_PREFERENCE_UPDATE_DESCRIPTION;
  payload: {
    perimeterId: number;
    activityCategoryId: number;
    description: string;
  };
}

export interface UpdateOrders {
  type: ActivityCategoriesPreferencesType.ACTIVITY_CATEGORY_PREFERENCE_UPDATE_ORDERS;
  payload: {
    perimeterId: number;
    categorySettings: { activityCategoryId: number; order: number }[];
  };
}

export interface SaveOrders {
  type: ActivityCategoriesPreferencesType.ACTIVITY_CATEGORY_PREFERENCE_SAVE_ORDERS;
  payload: {
    perimeterId: number;
    categorySettings: { activityCategoryId: number; order: number }[];
  };
}

export interface ResetCategoriesPreferencesState {
  type: ActivityCategoriesPreferencesType.RESET_CATEGORY_PREFERENCES_STATE;
}

export function setAllActivityCategoriesPreferences(
  payload: UserPreferencesActivityCategoryResponse[]
): SetAllActivityCategoriesPreferences {
  return {
    type: ActivityCategoriesPreferencesType.SET_ALL_ACTIVITY_CATEGORIES_PREFERENCES,
    payload,
  };
}

export function requestFetchActivityCategoryPreferences(perimeterId: number): ActivityCategoriesPreferencesRequested {
  return {
    type: ActivityCategoriesPreferencesType.ACTIVITY_CATEGORIES_PREFERENCES_REQUESTED,
    payload: perimeterId,
  };
}

export function updateDescription(
  perimeterId: number,
  activityCategoryId: number,
  description: string
): UpdateDescription {
  return {
    type: ActivityCategoriesPreferencesType.ACTIVITY_CATEGORY_PREFERENCE_UPDATE_DESCRIPTION,
    payload: {
      perimeterId,
      activityCategoryId,
      description,
    },
  };
}

export function updateOrders(payload: {
  perimeterId: number;
  categorySettings: { activityCategoryId: number; order: number }[];
}): UpdateOrders {
  return {
    type: ActivityCategoriesPreferencesType.ACTIVITY_CATEGORY_PREFERENCE_UPDATE_ORDERS,
    payload,
  };
}

export function saveOrders(payload: {
  perimeterId: number;
  categorySettings: { activityCategoryId: number; order: number }[];
}): SaveOrders {
  return {
    type: ActivityCategoriesPreferencesType.ACTIVITY_CATEGORY_PREFERENCE_SAVE_ORDERS,
    payload,
  };
}

export function resetCategoriesPreferencesState(): ResetCategoriesPreferencesState {
  return {
    type: ActivityCategoriesPreferencesType.RESET_CATEGORY_PREFERENCES_STATE,
  };
}
