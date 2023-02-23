import { Action } from "@actions/readOnlyMode/readOnlyModeActions";
import { ReadOnlyModeTypes } from "@actions/readOnlyMode/types";

export interface ReadOnlyModeState {
  showPopup: boolean;
}

const initialState: ReadOnlyModeState = {
  showPopup: false,
};

function reducer(
  state: ReadOnlyModeState = initialState,
  action: Action
): ReadOnlyModeState {
  switch (action.type) {
    case ReadOnlyModeTypes.SHOW_POPUP: {
      return { ...state, showPopup: true };
    }
    case ReadOnlyModeTypes.HIDE_POPUP: {
      return { ...state, showPopup: false };
    }
    default:
      return state;
  }
}

export default reducer;
