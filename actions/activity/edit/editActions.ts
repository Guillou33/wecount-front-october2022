import { CustomThunkAction } from "@custom-types/redux";
import { EditTypes } from "@actions/activity/edit/types";

export type Action = StartEdit | EndEdit | CloseModale;

interface StartEdit {
  type: EditTypes.ACTIVITY_EDIT_START;
  payload: {
    activityModelId: number;
  };
}
interface EndEdit {
  type: EditTypes.ACTIVITY_EDIT_END;
}
interface CloseModale {
  type: EditTypes.ACTIVITY_EDIT_CLOSE_MODALE;
}

export const startEdit = ({
  activityModelId,
}: {
  activityModelId: number;
}): StartEdit => {
  return {
    type: EditTypes.ACTIVITY_EDIT_START,
    payload: {
      activityModelId,
    },
  };
};

export const endEdit = (): EndEdit => {
  return {
    type: EditTypes.ACTIVITY_EDIT_END,
  };
};

// quick fix for "close modale and field blur" bug
export const visuallyCloseModale = (): CloseModale => ({
  type: EditTypes.ACTIVITY_EDIT_CLOSE_MODALE,
});

// quick fix for "close modale and field blur" bug
export function closeModaleAndTimeoutEndEdit(): CustomThunkAction {
  return async dispatch => {
    dispatch(visuallyCloseModale());
    await new Promise(resolve => setTimeout(resolve, 500));
    dispatch(endEdit());
  };
}
