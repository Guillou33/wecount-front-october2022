import immer from "immer";

import { EntryTagTypes } from "@actions/core/entryTag/types";
import { Action } from "@actions/core/entryTag/entryTagActions";

import { EntryTagResponse } from "@lib/wecount-api/responses/apiResponses";

export type EntryTagList = Record<number, EntryTagResponse>;

export type EntryTagState = {
  entryTagList: EntryTagList;
  isFetched: boolean;
  isFetching: boolean;
  isCreating: boolean;
  creationError: boolean;
};

const initialEntryTagState: EntryTagState = {
  entryTagList: {},
  isFetched: false,
  isFetching: false,
  isCreating: false,
  creationError: false,
};

function reducer(state = initialEntryTagState, action: Action): EntryTagState {
  switch (action.type) {
    case EntryTagTypes.IS_FETCHING: {
      return {
        ...state,
        isFetching: true,
      };
    }
    case EntryTagTypes.SET_ENTRY_TAGS: {
      return {
        ...state,
        isFetching: false,
        isFetched: true,
        entryTagList: action.payload.entryTags.reduce((acc, entryTag) => {
          acc[entryTag.id] = { ...entryTag };
          return acc;
        }, {} as EntryTagList),
      };
    }
    case EntryTagTypes.CREATE_REQUESTED: {
      return {
        ...state,
        isCreating: true,
        creationError: false,
      };
    }
    case EntryTagTypes.CREATED: {
      return {
        ...state,
        isCreating: false,
        creationError: false,
        entryTagList: {
          ...state.entryTagList,
          [action.payload.entryTag.id]: { ...action.payload.entryTag },
        },
      };
    }
    case EntryTagTypes.CREATION_ERROR: {
      return {
        ...state,
        isCreating: false,
        creationError: true,
      };
    }
    case EntryTagTypes.CREATION_ERROR_REMOVED: {
      return {
        ...state,
        creationError: false,
      };
    }
    case EntryTagTypes.UPDATE_REQUESTED: {
      const { entryTagId, newName } = action.payload;
      return immer(state, draftState => {
        if (draftState.entryTagList[entryTagId] != null) {
          draftState.entryTagList[entryTagId].name = newName;
        }
      });
    }
    case EntryTagTypes.ARCHIVE_REQUESTED: {
      const { entryTagId } = action.payload;
      return immer(state, draftState => {
        if (draftState.entryTagList[entryTagId] != null) {
          draftState.entryTagList[entryTagId].archivedDate =
            new Date().toISOString();
        }
      });
    }
    case EntryTagTypes.UNARCHIVE_REQUESTED: {
      const { entryTagId } = action.payload;
      return immer(state, draftState => {
        if (draftState.entryTagList[entryTagId] != null) {
          draftState.entryTagList[entryTagId].archivedDate = null;
        }
      });
    }
    case EntryTagTypes.RESET_ENTRY_TAGS_STATE: {
      return { ...initialEntryTagState };
    }
    default:
      return state;
  }
}

export default reducer;
