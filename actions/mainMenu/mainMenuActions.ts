import { MainMenuTypes } from "./types";
import { SubMenu } from "@reducers/mainMenu/mainMenuReducer";
export type Action = ToggleSubMenu | OpenSubMenu;

export interface ToggleSubMenu {
  type: MainMenuTypes.TOGGLE_SUB_MENU;
  payload: {
    subMenu: SubMenu;
  };
}

export interface OpenSubMenu {
  type: MainMenuTypes.OPEN_SUB_MENU;
  payload: { subMenu: SubMenu };
}

export function toggleSubMenu(subMenu: SubMenu): ToggleSubMenu {
  return {
    type: MainMenuTypes.TOGGLE_SUB_MENU,
    payload: { subMenu },
  };
}

export function openSubMenu(subMenu: SubMenu): OpenSubMenu {
  return {
    type: MainMenuTypes.OPEN_SUB_MENU,
    payload: { subMenu },
  };
}
