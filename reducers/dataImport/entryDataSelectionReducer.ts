import immer from "immer";

import { EntryDataSelectionTypes } from "@actions/dataImport/entryDataSelection/types";
import { Action } from "@actions/dataImport/entryDataSelection/entryDataSelectionActions";
import {
  DeleteEntryData,
  SetEntryDataList,
} from "@actions/dataImport/entryData/entryDataActions";
import { DataImportTypes } from "@actions/dataImport/entryData/types";

export type State = {
  selectedAre: "markedEntries" | "allEntriesMinusMarkedEntries";
  markedEntryData: Record<string, true>;
};

const INITIAL_STATE: State = {
  selectedAre: "markedEntries",
  markedEntryData: {},
};

function reducer(
  state: State = INITIAL_STATE,
  action: Action | DeleteEntryData | SetEntryDataList
): State {
  switch (action.type) {
    case EntryDataSelectionTypes.SET_SELECTION: {
      const { selectedEntryData } = action.payload;
      return { ...state, markedEntryData: selectedEntryData };
    }
    case EntryDataSelectionTypes.TOGGLE_ENTRY_DATA: {
      const { entryDataId } = action.payload;
      return immer(state, draftState => {
        const isEntryDataSelected =
          draftState.markedEntryData[entryDataId] != null;
        if (isEntryDataSelected) {
          delete draftState.markedEntryData[entryDataId];
        } else {
          draftState.markedEntryData[entryDataId] = true;
        }
      });
    }
    case EntryDataSelectionTypes.SELECT_ALL: {
      return {
        ...state,
        selectedAre: "allEntriesMinusMarkedEntries",
        markedEntryData: {},
      };
    }
    case EntryDataSelectionTypes.UNSELECT_ALL: {
      return { ...state, selectedAre: "markedEntries", markedEntryData: {} };
    }
    case DataImportTypes.DELETE_ENTRY_DATA: {
      const { entryDataIds } = action.payload;
      return immer(state, draftState => {
        entryDataIds.forEach(entryDataId => {
          delete draftState.markedEntryData[entryDataId];
        });
      });
    }
    case DataImportTypes.SET_ENTRY_DATA_LIST: {
      return { ...INITIAL_STATE };
    }
    default: {
      return state;
    }
  }
}

export default reducer;
