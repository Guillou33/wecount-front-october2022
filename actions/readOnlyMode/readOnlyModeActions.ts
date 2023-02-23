import { ReadOnlyModeTypes } from "./types";

export type Action =
  | ShowReadOnlyModeFeedbackPopup
  | HideReadOnlyModeFeedbackPopup;

interface ShowReadOnlyModeFeedbackPopup {
  type: ReadOnlyModeTypes.SHOW_POPUP;
}

interface HideReadOnlyModeFeedbackPopup {
  type: ReadOnlyModeTypes.HIDE_POPUP;
}

export function showReadOnlyModeFeedbackPopup(): ShowReadOnlyModeFeedbackPopup {
  return {
    type: ReadOnlyModeTypes.SHOW_POPUP,
  };
}

export function hideReadOnlyModeFeedbackPopup(): HideReadOnlyModeFeedbackPopup {
  return {
    type: ReadOnlyModeTypes.HIDE_POPUP,
  };
}
