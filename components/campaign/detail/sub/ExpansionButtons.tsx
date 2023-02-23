import cx from "classnames";

import { useSelector, useDispatch } from "react-redux";

import { RootState } from "@reducers/index";
import { CardExpansionNames } from "@reducers/cardExpansion/cardExpansionReducer";

import {
  openAllCards,
  closeAllCards,
} from "@actions/cardExpansion/cardExpansionActions";

import Tooltip from "@components/helpers/bootstrap/Tooltip";
import styles from "@styles/campaign/detail/sub/expansionButtons.module.scss";
import { upperFirst } from "lodash";
import { t } from "i18next";

interface Props {
  cardExpansionName: CardExpansionNames;
}

const ExpansionButtons = ({ cardExpansionName }: Props) => {
  const dispatch = useDispatch();
  const mode = useSelector(
    (state: RootState) => state.cardExpansion[cardExpansionName].mode
  );

  function onFoldAllClick() {
    dispatch(
      closeAllCards({
        cardExpansionName,
      })
    );
  }

  function onExpandAllClick() {
    dispatch(
      openAllCards({
        cardExpansionName,
      })
    );
  }

  return (
    <div className={cx(styles.expansionButtons, "button-2")}>
      <Tooltip content={upperFirst(t("activity.expansion.foldAll"))} hideDelay={0}>
        <button
          className={cx(styles.expansionButton, styles.foldAll, {
            [styles.active]: mode === "allFolded",
          })}
          onClick={onFoldAllClick}
        ></button>
      </Tooltip>
      <Tooltip content={upperFirst(t("activity.expansion.expandAll"))} hideDelay={0}>
        <button
          className={cx(styles.expansionButton, styles.expandToActivityModels, {
            [styles.active]: mode === "allExpanded",
          })}
          onClick={onExpandAllClick}
        ></button>
      </Tooltip>
    </div>
  );
};

export default ExpansionButtons;
