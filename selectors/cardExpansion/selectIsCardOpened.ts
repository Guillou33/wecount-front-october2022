import { RootState } from "@reducers/index";
import { CardExpansionNames } from "@reducers/cardExpansion/cardExpansionReducer";

function selectIsCardOpened(
  state: RootState,
  cardExpansionName: CardExpansionNames,
  cardId: string
): boolean {
  const expansionMode =
    state.cardExpansion[cardExpansionName].mode;
  const isCardInList =
    state.cardExpansion[cardExpansionName].cardList[cardId];

  if (expansionMode === "allFolded") {
    return isCardInList;
  }
  return !isCardInList;
}

export default selectIsCardOpened;
