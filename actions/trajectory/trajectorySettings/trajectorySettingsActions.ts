import { Scope } from "@custom-types/wecount-api/activity";
import { TrajectorySettings } from "@reducers/trajectory/trajectorySettings/trajectorySettingsReducer";

import { TrajectorySettingsTypes } from "./types";

export type TrajectorySettingsData = Omit<TrajectorySettings, "isFetched">;

export type Action =
  | SetTrajectorySettings
  | SetScopeTarget
  | SaveScopeTargetRequested
  | SetTargetYear
  | ResetTrajectorySettingsState
  | SaveTargetYearRequested;

interface SetTrajectorySettings {
  type: TrajectorySettingsTypes.SET_TRAJECTORY_SETTINGS;
  payload: TrajectorySettingsData;
}

export function setTrajectorySettings(
  trajectorysettings: TrajectorySettingsData
): SetTrajectorySettings {
  return {
    type: TrajectorySettingsTypes.SET_TRAJECTORY_SETTINGS,
    payload: trajectorysettings,
  };
}

interface SetScopeTarget {
  type: TrajectorySettingsTypes.SET_SCOPE_TARGET;
  payload: {
    scope: Scope;
    target: number | null;
    description: string | null;
  };
}

export function setScopeTarget(
  scope: Scope,
  target: number | null,
  description: string | null
): SetScopeTarget {
  return {
    type: TrajectorySettingsTypes.SET_SCOPE_TARGET,
    payload: {
      scope,
      target,
      description,
    },
  };
}

export interface SaveScopeTargetRequested {
  type: TrajectorySettingsTypes.SAVE_SCOPE_TARGET_REQUESTED;
  paylaod: {
    trajectorySettingsId: number;
    scope: Scope;
    target: number | null;
    description: string | null;
  };
}

export function requestSaveScopeTarget(
  trajectorySettingsId: number,
  scope: Scope,
  target: number | null,
  description: string | null
): SaveScopeTargetRequested {
  return {
    type: TrajectorySettingsTypes.SAVE_SCOPE_TARGET_REQUESTED,
    paylaod: {
      trajectorySettingsId,
      scope,
      target,
      description,
    },
  };
}

export interface SetTargetYear {
  type: TrajectorySettingsTypes.SET_TARGET_YEAR;
  payload: number | null;
}

export function setTargetYear(targetYear: number | null): SetTargetYear {
  return {
    type: TrajectorySettingsTypes.SET_TARGET_YEAR,
    payload: targetYear,
  };
}

export interface LoadTrajectorySettingsRequested {
  type: TrajectorySettingsTypes.LOAD_TRAJECTORY_SETTINGS_REQUESTED;
  payload: {
    perimeterId: number;
  };
}

export function requestLoadTrajectorySettings(
  perimeterId: number
): LoadTrajectorySettingsRequested {
  return {
    type: TrajectorySettingsTypes.LOAD_TRAJECTORY_SETTINGS_REQUESTED,
    payload: {
      perimeterId,
    },
  };
}

interface ResetTrajectorySettingsState {
  type: TrajectorySettingsTypes.RESET_TRAJECTORY_SETTINGS_STATE;
}

export function resetTrajectorySettingsState(): ResetTrajectorySettingsState {
  return {
    type: TrajectorySettingsTypes.RESET_TRAJECTORY_SETTINGS_STATE,
  };
}

export interface SaveTargetYearRequested {
  type: TrajectorySettingsTypes.SAVE_TRAJECTORY_TARGET_YEAR_REQUESTED;
  payload: {
    trajectorySettingsId: number;
    targetYear: number;
  };
}

export function requestSaveTargetYear(
  trajectorySettingsId: number,
  targetYear: number
): SaveTargetYearRequested {
  return {
    type: TrajectorySettingsTypes.SAVE_TRAJECTORY_TARGET_YEAR_REQUESTED,
    payload: {
      trajectorySettingsId,
      targetYear,
    },
  };
}
