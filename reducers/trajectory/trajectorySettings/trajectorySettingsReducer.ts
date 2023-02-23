import immer from "immer";

import { Scope } from "@custom-types/wecount-api/activity";
import { Action } from "@actions/trajectory/trajectorySettings/trajectorySettingsActions";
import { TrajectorySettingsTypes } from "@actions/trajectory/trajectorySettings/types";

export type ScopeTargets = {
  [scope in Scope]: { target: number | null; description: string | null };
};

export interface TrajectorySettings {
  id: number | null;
  scopeTargets: ScopeTargets;
  targetYear: number | null;
  isFetched: boolean;
}

const getInitialScopeTarget = () => ({
  target: null,
  description: null,
});

const INITIAL_STATE: TrajectorySettings = {
  id: null,
  scopeTargets: {
    [Scope.UPSTREAM]: getInitialScopeTarget(),
    [Scope.CORE]: getInitialScopeTarget(),
    [Scope.DOWNSTREAM]: getInitialScopeTarget(),
  },
  targetYear: null,
  isFetched: false,
};

type TrajectorySettingsState = TrajectorySettings;

function reducer(
  state: TrajectorySettingsState = INITIAL_STATE,
  action: Action
): TrajectorySettingsState {
  switch (action.type) {
    case TrajectorySettingsTypes.SET_TRAJECTORY_SETTINGS: {
      return { ...action.payload, isFetched: true };
    }
    case TrajectorySettingsTypes.SET_SCOPE_TARGET: {
      const { scope, target, description } = action.payload;
      return immer(state, draftState => {
        draftState.scopeTargets[scope].target = target;
        draftState.scopeTargets[scope].description = description;
      });
    }
    case TrajectorySettingsTypes.SET_TARGET_YEAR: {
      return {
        ...state,
        targetYear: action.payload,
      };
    }
    case TrajectorySettingsTypes.RESET_TRAJECTORY_SETTINGS_STATE: {
      return { ...INITIAL_STATE };
    }
    default:
      return state;
  }
}

export default reducer;
