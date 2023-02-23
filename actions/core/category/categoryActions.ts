import { Dispatch } from 'redux';
import ApiClient from '@lib/wecount-api/ApiClient';
import { CustomThunkAction } from '@custom-types/redux';
import { CategoryTypes } from '@actions/core/category/types';
import { ApiRoutes, generateRoute } from '@lib/wecount-api/routes/apiRoutes';
import { ActivityCategoriesResponse } from '@lib/wecount-api/responses/apiResponses';

export type Action = SetActivityCategoriesAction;

interface SetActivityCategoriesAction {
  type: CategoryTypes.SET_ACTIVITY_CATEGORIES;
  payload: {
    activityCategories: ActivityCategoriesResponse;
  };
}

export const setActivityCategories = (customApiClient?: ApiClient): CustomThunkAction => {
  return async (dispatch: Dispatch) => {
    const apiClient = customApiClient ?? ApiClient.buildFromBrowser();
    const response = await apiClient.get<ActivityCategoriesResponse>(ApiRoutes.ACTIVITY_CATEGORIES);

    dispatch<SetActivityCategoriesAction>({
      type: CategoryTypes.SET_ACTIVITY_CATEGORIES,
      payload: {
        activityCategories: response.data,
      },
    });
  }
}
