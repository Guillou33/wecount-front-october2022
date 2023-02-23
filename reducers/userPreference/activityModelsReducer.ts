import { Action } from "@actions/userPreference/activityModels/activityModelsActions";
import { ActivityModelsTypes } from "@actions/userPreference/activityModels/types";

export interface VisibleActivityModels {
  [key: string]: boolean;
}
export interface ActivityModelsPreferenceState {
  visibleActivityModels: VisibleActivityModels | null;
}

const initialState: ActivityModelsPreferenceState = {
  visibleActivityModels: null,
};

const reducer = (
  state: ActivityModelsPreferenceState = initialState,
  action: Action
): ActivityModelsPreferenceState => {
  switch (action.type) {
    case ActivityModelsTypes.SET_VISIBLE_ACTIVITY_MODELS:
      return {
        ...state,
        visibleActivityModels: action.payload.visibleActivityModels,
      };

    case ActivityModelsTypes.RESET_VISIBLE_ACTIVITY_MODELS_STATE:
      return initialState;

    default:
      return state;
  }
};

export default reducer;
