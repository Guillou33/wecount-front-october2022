import { TrajectorySettingsResponse } from "@lib/wecount-api/responses/apiResponses";
import { ScopeTargets } from "@reducers/trajectory/trajectorySettings/trajectorySettingsReducer";

import { TrajectorySettingsData } from "@actions/trajectory/trajectorySettings/trajectorySettingsActions";

export function scopeTargetTransformer(
  trajectorySettingsResponse: TrajectorySettingsResponse
): TrajectorySettingsData {
  const scopeTargets = trajectorySettingsResponse.scopeTargets.reduce(
    (acc, scopeTarget) => {
      const { target, description } = scopeTarget;
      acc[scopeTarget.scope] = {
        target,
        description,
      };
      return acc;
    },
    {} as ScopeTargets
  );

  return {
    ...trajectorySettingsResponse,
    scopeTargets,
  };
}
