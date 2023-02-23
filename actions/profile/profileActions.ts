import { Dispatch } from 'redux';
import ApiClient from '@lib/wecount-api/ApiClient';
import { CustomThunkAction } from '@custom-types/redux';
import { ProfileTypes } from '@actions/profile/types';
import { ApiRoutes } from '@lib/wecount-api/routes/apiRoutes';
import { UserFullResponse } from '@lib/wecount-api/responses/apiResponses';

export type Action = SetInfo;

interface SetInfo {
  type: ProfileTypes.SET_INFO;
  payload: UserFullResponse;
}

export const setProfileInfo = (customApiClient?: ApiClient): CustomThunkAction => {
  return async (dispatch: Dispatch) => {
    const apiClient = customApiClient ?? ApiClient.buildFromBrowser();
    const response = await apiClient.get<UserFullResponse>(ApiRoutes.USER_FULL);

    dispatch<SetInfo>({
      type: ProfileTypes.SET_INFO,
      payload: response.data,
    });
  }
}
