import { EditTypes } from "@actions/activity/edit/types";
import { Action } from "@actions/activity/edit/editActions";

export interface ActivityEditState {
  activityId: number | undefined;
  isEditing: boolean;
  isModalOpened: boolean; // quick fix for "close modale and field blur" bug
  activityModelId: number | undefined;
}

/**
 * Initial reducer state
 * @type {Object}
 */
const INITIAL_STATE: ActivityEditState = {
  activityId: undefined,
  isEditing: false,
  isModalOpened: false,
  activityModelId: undefined,
};

/**
 * Updates reducer state depending on action type
 * @param {Object} state - the reducer state
 * @param {Object} action - the fired action object
 * @param {string} action.type - the action type
 * @param {?Object} action.payload - additional action data
 * @return {Object} new reducer state
 */

const reducer = (
  state: ActivityEditState = INITIAL_STATE,
  action: Action
): ActivityEditState => {
  switch (action.type) {
    case EditTypes.ACTIVITY_EDIT_START:
      return startEdit(state, action.payload.activityModelId);
    case EditTypes.ACTIVITY_EDIT_END:
      return { ...INITIAL_STATE };
    case EditTypes.ACTIVITY_EDIT_CLOSE_MODALE:
      return { ...state, isModalOpened: false };
    default:
      return state;
  }
};

const startEdit = (state: ActivityEditState, activityModelId: number) => {
  return {
    ...state,
    isEditing: true,
    isModalOpened: true,
    activityModelId: activityModelId,
  };
};

export default reducer;
