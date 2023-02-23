import { useSelector } from "react-redux";

import { RootState } from "@reducers/index";
import { CardExpansionNames } from "@reducers/cardExpansion/cardExpansionReducer";

function useIsCardOpened(cardExpansionName: CardExpansionNames) {
  const cardExpansion = useSelector(
    (state: RootState) => state.cardExpansion[cardExpansionName]
  );
  const expansionMode = cardExpansion.mode;
  
  return (cardId: string): boolean => {
    const isCardInList = cardExpansion.cardList[cardId];
    if (expansionMode === "allFolded") {
      return isCardInList;
    }
    return !isCardInList;
  };
}

export default useIsCardOpened;
