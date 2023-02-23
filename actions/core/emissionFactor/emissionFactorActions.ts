import ApiClient from "@lib/wecount-api/ApiClient";
import { CustomThunkAction } from "@custom-types/redux";
import { EmissionFactorTypes } from "@actions/core/emissionFactor/types";
import { ApiRoutes, generateRoute } from "@lib/wecount-api/routes/apiRoutes";
import { ComputeMethodResponse } from "@lib/wecount-api/responses/apiResponses";
import { EmissionFactorMapping } from "@reducers/core/emissionFactorReducer";

export type Action =
  | FetchedAction
  | RequestAutocompleteAction
  | AutocompleteFilledAction;

interface FetchedAction {
  type: EmissionFactorTypes.FETCHED_COMPUTE_METHODS;
  payload: {
    computeMethods: ComputeMethodResponse[];
    activityModelId: number;
  };
}

export interface RequestAutocompleteAction {
  type: EmissionFactorTypes.AUTOCOMPLETE_REQUESTED;
  payload: {
    activityModelId: number;
    computeMethodId: number;
    searchText: string;
  };
}

export interface AutocompleteFilledAction {
  type: EmissionFactorTypes.AUTOCOMPLETE_FILLED;
  payload: {
    activityModelId: number;
    computeMethodId: number;
    emissionFactorMappings: EmissionFactorMapping[];
  };
}

export const getComputeMethodsWithEF = (
  activityModelId: number
): CustomThunkAction => {
  return async dispatch => {
    const apiClient = ApiClient.buildFromBrowser();
    const response = await apiClient.get<ComputeMethodResponse[]>(
      generateRoute(ApiRoutes.COMPUTE_METHODS),
      true,
      {
        params: {
          activityModelId,
        },
      }
    );

    dispatch<FetchedAction>({
      type: EmissionFactorTypes.FETCHED_COMPUTE_METHODS,
      payload: {
        activityModelId,
        computeMethods: response.data,
      },
    });
  };
};

export const autocompleteEmissionFactors = ({
  activityModelId,
  computeMethodId,
  searchText,
}: {
  activityModelId: number;
  computeMethodId: number;
  searchText: string;
}): RequestAutocompleteAction => {
  return {
    type: EmissionFactorTypes.AUTOCOMPLETE_REQUESTED,
    payload: {
      activityModelId,
      computeMethodId,
      searchText,
    },
  };
};

export const fillAutocompleteEmissionFactors = ({
  activityModelId,
  computeMethodId,
  emissionFactorMappings,
}: {
  activityModelId: number;
  computeMethodId: number;
  emissionFactorMappings: EmissionFactorMapping[];
}): AutocompleteFilledAction => {
  return {
    type: EmissionFactorTypes.AUTOCOMPLETE_FILLED,
    payload: {
      activityModelId,
      computeMethodId,
      emissionFactorMappings,
    },
  };
};

export const getComputeMethodsWithEfIfNeeded = (
  activityModelId: number
): CustomThunkAction => {
  return async (dispatch, getState) => {
    const computeMethods =
      getState().core.emissionFactor.mapping[activityModelId];
    if (computeMethods == null) {
      dispatch(getComputeMethodsWithEF(activityModelId));
    }
  };
};
