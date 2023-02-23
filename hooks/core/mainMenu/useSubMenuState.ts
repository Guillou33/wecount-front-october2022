import { useSelector, useDispatch } from "react-redux";
import { SubMenu } from "@reducers/mainMenu/mainMenuReducer";
import { toggleSubMenu } from "@actions/mainMenu/mainMenuActions";
import { RootState } from "@reducers/index";

function useSubMenuState(subMenu: SubMenu): [boolean, () => void] {
  const dispatch = useDispatch();
  const openedSubMenu = useSelector<RootState, SubMenu>(
    state => state.mainMenu.openedSubMenu
  );
  const isSubMenuOpened = openedSubMenu === subMenu;

  const subMenuToggler = () => dispatch(toggleSubMenu(subMenu));

  return [isSubMenuOpened, subMenuToggler];
}

export default useSubMenuState;
