import { EntryDataSelectionTypes } from "./types";

export type Action = SetSelection | ToggleEntryData | SelectAll | UnselectAll;

interface SetSelection {
  type: EntryDataSelectionTypes.SET_SELECTION;
  payload: {
    selectedEntryData: Record<string, true>;
  };
}

interface ToggleEntryData {
  type: EntryDataSelectionTypes.TOGGLE_ENTRY_DATA;
  payload: {
    entryDataId: string;
  };
}

interface SelectAll {
  type: EntryDataSelectionTypes.SELECT_ALL;
}

interface UnselectAll {
  type: EntryDataSelectionTypes.UNSELECT_ALL;
}

export function setSelection(payload: SetSelection["payload"]): SetSelection {
  return {
    type: EntryDataSelectionTypes.SET_SELECTION,
    payload,
  };
}

export function toggleEntryData(
  payload: ToggleEntryData["payload"]
): ToggleEntryData {
  return {
    type: EntryDataSelectionTypes.TOGGLE_ENTRY_DATA,
    payload,
  };
}

export function selectAll(): SelectAll {
  return {
    type: EntryDataSelectionTypes.SELECT_ALL,
  };
}

export function unselectAll(): UnselectAll {
  return {
    type: EntryDataSelectionTypes.UNSELECT_ALL,
  };
}
