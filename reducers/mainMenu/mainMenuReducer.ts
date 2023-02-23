import { Action } from "@actions/mainMenu/mainMenuActions";
import { MainMenuTypes } from "@actions/mainMenu/types";

export type SubMenu = "" | "cartography" | "dashboard" | "trajectory" | "reports";

export interface MainMenuState {
  openedSubMenu: SubMenu;
}

const initialState: MainMenuState = {
  openedSubMenu: "",
};

function reducer(
  state: MainMenuState = initialState,
  action: Action
): MainMenuState {
  switch (action.type) {
    case MainMenuTypes.TOGGLE_SUB_MENU: {
      const { subMenu } = action.payload;
      return {
        ...state,
        openedSubMenu: subMenu !== state.openedSubMenu ? subMenu : "",
      };
    }
    case MainMenuTypes.OPEN_SUB_MENU: {
      return { ...state, openedSubMenu: action.payload.subMenu };
    }
    default:
      return state;
  }
}

export default reducer;
