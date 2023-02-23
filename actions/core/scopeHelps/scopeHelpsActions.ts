import ApiClient from "@lib/wecount-api/ApiClient";
import { CustomThunkAction } from "@custom-types/redux";
import { ApiRoutes } from "@lib/wecount-api/routes/apiRoutes";

import { ScopeHelpsTypes } from "@actions/core/scopeHelps/types";
import { ScopeHelpResponse } from "@lib/wecount-api/responses/apiResponses";

export type Action = SetScopeHelps;

interface SetScopeHelps {
  type: ScopeHelpsTypes.SET_SCOPE_HELPS;
  payload: ScopeHelpResponse[];
}

export function setScopeHelps(scopeHelps: ScopeHelpResponse[]): SetScopeHelps {
  return {
    type: ScopeHelpsTypes.SET_SCOPE_HELPS,
    payload: scopeHelps,
  };
}

export function fetchScopeHelps(): CustomThunkAction {
  return async dispatch => {
    const apiClient = ApiClient.buildFromBrowser();
    const response = await apiClient.get<ScopeHelpResponse[]>(
      ApiRoutes.SCOPE_HELPS
    );
    dispatch(setScopeHelps(response.data));
  };
}
