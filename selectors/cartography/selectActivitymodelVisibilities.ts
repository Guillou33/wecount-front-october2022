import { RootState } from "@reducers/index";
import { VisibleActivityModels } from "@reducers/userPreference/activityModelsReducer";

function selectActivityModelVisibilities(
  state: RootState
): VisibleActivityModels | null {
  return state.userPreference.activityModels.visibleActivityModels;
}

export default selectActivityModelVisibilities;
