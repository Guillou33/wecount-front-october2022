import { CardExpansionTypes } from "./types";
import { CardExpansionNames } from "@reducers/cardExpansion/cardExpansionReducer";

export type Action =
  | CloseAllCards
  | ToggleCard
  | CloseCard
  | OpenCard
  | OpenAllCards;

interface CloseAllCards {
  type: CardExpansionTypes.CLOSE_ALL_CARDS;
  payload: {
    cardExpansionName: CardExpansionNames;
  };
}

export function closeAllCards(
  payload: CloseAllCards["payload"]
): CloseAllCards {
  return {
    type: CardExpansionTypes.CLOSE_ALL_CARDS,
    payload,
  };
}

interface OpenAllCards {
  type: CardExpansionTypes.OPEN_ALL_CARDS;
  payload: {
    cardExpansionName: CardExpansionNames;
  };
}

export function openAllCards(payload: OpenAllCards["payload"]): OpenAllCards {
  return {
    type: CardExpansionTypes.OPEN_ALL_CARDS,
    payload,
  };
}

interface ToggleCard {
  type: CardExpansionTypes.TOGGLE_CARD;
  payload: {
    cardExpansionName: CardExpansionNames;
    cardId: string;
  };
}

export function toggleCard(payload: ToggleCard["payload"]): ToggleCard {
  return {
    type: CardExpansionTypes.TOGGLE_CARD,
    payload,
  };
}

interface CloseCard {
  type: CardExpansionTypes.CLOSE_CARD;
  payload: {
    cardExpansionName: CardExpansionNames;
    cardId: string;
  };
}

export function closeCard(payload: ToggleCard["payload"]): CloseCard {
  return {
    type: CardExpansionTypes.CLOSE_CARD,
    payload,
  };
}

interface OpenCard {
  type: CardExpansionTypes.OPEND_CARD;
  payload: {
    cardExpansionName: CardExpansionNames;
    cardId: string;
  };
}

export function openCard(payload: OpenCard["payload"]): OpenCard {
  return {
    type: CardExpansionTypes.OPEND_CARD,
    payload,
  };
}
