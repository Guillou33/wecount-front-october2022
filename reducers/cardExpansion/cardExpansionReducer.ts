import immer from "immer";

import { CardExpansionTypes } from "@actions/cardExpansion/types";
import { Action } from "@actions/cardExpansion/cardExpansionActions";

export enum CardExpansionNames {
  LISTING_VIEW = "LISTING_VIEW",
  EDIT_ENTRIES = "EDIT_ENTRIES",
  CARTOGRAPHY = "CARTOGRAPHY",
  SITE_LISTING_VIEW = "SITE_LISTING_VIEW",
}

type CardExpansion = {
  cardList: { [key: string]: true };
  mode: "allFolded" | "allExpanded";
};

function getInitialCardExpansionstate(): CardExpansion {
  return {
    cardList: {},
    mode: "allFolded",
  };
}

export type State = {
  [expansionName in CardExpansionNames]: CardExpansion;
};

const initialState: State = {
  [CardExpansionNames.EDIT_ENTRIES]: getInitialCardExpansionstate(),
  [CardExpansionNames.LISTING_VIEW]: getInitialCardExpansionstate(),
  [CardExpansionNames.CARTOGRAPHY]: getInitialCardExpansionstate(),
  [CardExpansionNames.SITE_LISTING_VIEW]: getInitialCardExpansionstate(),
};

function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case CardExpansionTypes.CLOSE_ALL_CARDS: {
      const { cardExpansionName } = action.payload;
      return {
        ...state,
        [cardExpansionName]: {
          ...state[cardExpansionName],
          cardList: {},
          mode: "allFolded",
        },
      };
    }
    case CardExpansionTypes.TOGGLE_CARD: {
      const { cardExpansionName, cardId } = action.payload;
      return immer(state, draftState => {
        if (draftState[cardExpansionName].cardList[cardId]) {
          delete draftState[cardExpansionName].cardList[cardId];
        } else {
          draftState[cardExpansionName].cardList[cardId] = true;
        }
      });
    }
    case CardExpansionTypes.CLOSE_CARD: {
      const { cardExpansionName, cardId } = action.payload;
      return immer(state, draftState => {
        if (state[cardExpansionName].mode === "allFolded") {
          if (draftState[cardExpansionName].cardList[cardId]) {
            delete draftState[cardExpansionName].cardList[cardId];
          }
        } else {
          draftState[cardExpansionName].cardList[cardId] = true;
        }
      });
    }
    case CardExpansionTypes.OPEND_CARD: {
      const { cardExpansionName, cardId } = action.payload;
      return immer(state, draftState => {
        if (state[cardExpansionName].mode === "allFolded") {
          draftState[cardExpansionName].cardList[cardId] = true;
        } else {
          if (draftState[cardExpansionName].cardList[cardId]) {
            delete draftState[cardExpansionName].cardList[cardId];
          }
        }
      });
    }

    case CardExpansionTypes.OPEN_ALL_CARDS: {
      const { cardExpansionName } = action.payload;
      return {
        ...state,
        [cardExpansionName]: {
          cardList: {},
          mode: "allExpanded",
        },
      };
    }
    default:
      return state;
  }
}

export default reducer;
