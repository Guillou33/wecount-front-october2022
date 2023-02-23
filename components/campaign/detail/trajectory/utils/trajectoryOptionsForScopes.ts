import { Scope } from "@custom-types/wecount-api/activity";
import { trajectoryOptions } from "../helpers/trajectoryOptions";

export const getTrajectoryOptionsforScope = (selectedScope: Scope) => {
  let trajectoryOptionsforScope: { value: number; label: string }[] = [];
  if (selectedScope !== Scope.CORE) {
    trajectoryOptionsforScope = trajectoryOptions.filter(
      option => option.label !== "2°C"
    );
  } else {
    trajectoryOptionsforScope = trajectoryOptions.filter(
      option => option.label === "1.5°C"
    );
  }
  return trajectoryOptionsforScope;
};
