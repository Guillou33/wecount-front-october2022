import { Scope } from "@custom-types/wecount-api/activity";
import { Action } from "@actions/core/scopeHelps/scopeHelpsActions";
import { ScopeHelpsTypes } from "@actions/core/scopeHelps/types";
import { ScopeHelpResponse } from "@lib/wecount-api/responses/apiResponses";

export type ScopeHelpsState = {
  [scope in Scope]: string | null;
};

const initialState: ScopeHelpsState = {
  [Scope.UPSTREAM]: null,
  [Scope.CORE]: null,
  [Scope.DOWNSTREAM]: null,
};

function formatScopeHelpsResponse(helps: ScopeHelpResponse[]): ScopeHelpsState {
  return helps.reduce((acc, help) => {
    acc[help.scope] = help.help;
    return acc;
  }, {} as ScopeHelpsState);
}

function reducer(
  state: ScopeHelpsState = initialState,
  action: Action
): ScopeHelpsState {
  switch (action.type) {
    case ScopeHelpsTypes.SET_SCOPE_HELPS:
      return formatScopeHelpsResponse(action.payload);
    default:
      return state;
  }
}

export default reducer;