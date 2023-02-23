import { Dispatch } from "redux";
import ApiClient from "@lib/wecount-api/ApiClient";
import { ApiRoutes, generateRoute } from "@lib/wecount-api/routes/apiRoutes";
import { CartographySettingsResponse } from "@lib/wecount-api/responses/apiResponses";
import { ActivityModelsTypes } from "./types";
import { VisibleActivityModels } from "@reducers/userPreference/activityModelsReducer";
import { CustomThunkAction } from "@custom-types/redux";

export type Action = SetVisibleActivityModelsAction | ResetVisibleActivityModelsAction;

export interface SetVisibleActivityModelsAction {
  type: ActivityModelsTypes.SET_VISIBLE_ACTIVITY_MODELS;
  payload: {
    visibleActivityModels: VisibleActivityModels;
  };
}

interface ResetVisibleActivityModelsAction {
  type: ActivityModelsTypes.RESET_VISIBLE_ACTIVITY_MODELS_STATE;
}

export function setVisibleActivityModels(
  activityModelsUniqueNames: string[]
): SetVisibleActivityModelsAction {
  const visibleActivityModels = activityModelsUniqueNames.reduce(
    (acc: VisibleActivityModels, activityModelUniqueName) => {
      acc[activityModelUniqueName] = true;
      return acc;
    },
    {}
  );
  return {
    type: ActivityModelsTypes.SET_VISIBLE_ACTIVITY_MODELS,
    payload: {
      visibleActivityModels,
    },
  };
}

export const updateActivityModelVisibility = (
  perimeterId: number,
  activityModelUniqueName: string,
  setVisible: boolean
): CustomThunkAction => {
  return async (dispatch: Dispatch, getState) => {
    const visibleActivityModelsCopy: { [key: string]: boolean } = {
      ...getState().userPreference.activityModels.visibleActivityModels,
    };
    if (setVisible) {
      visibleActivityModelsCopy[activityModelUniqueName] = true;
    } else {
      delete visibleActivityModelsCopy[activityModelUniqueName];
    }

    dispatch({
      type: ActivityModelsTypes.SET_VISIBLE_ACTIVITY_MODELS,
      payload: {
        visibleActivityModels: visibleActivityModelsCopy,
      },
    });

    const apiClient = ApiClient.buildFromBrowser();
    await apiClient.post(
      generateRoute(ApiRoutes.USER_PREFERENCE_ACTIVITY_MODEL_VISIBILITIES),
      {
        perimeterId,
        visibleActivityModels: Object.keys(visibleActivityModelsCopy),
      }
    );
  };
};

export const loadActivityModelVisibilities = (
  perimeterId: number,
  customApiClient?: ApiClient
): CustomThunkAction => {
  return async (dispatch: Dispatch) => {
    const apiClient = customApiClient ?? ApiClient.buildFromBrowser();
    const response = await apiClient.get<CartographySettingsResponse>(
      generateRoute(ApiRoutes.PERIMETERS_CARTOGRAPHY_SETTINGS, {
        id: perimeterId,
      })
    );
    dispatch(setVisibleActivityModels(response.data.visibleActivityModels));
  };
};

export function resetVisibleActivityModelsState(): ResetVisibleActivityModelsAction {
  return {
    type: ActivityModelsTypes.RESET_VISIBLE_ACTIVITY_MODELS_STATE,
  };
}