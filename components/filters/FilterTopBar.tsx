import { useSelector, useDispatch } from "react-redux";
import cx from "classnames";

import TopBar from "@components/helpers/ui/TopBar";
import Checkbox from "@components/helpers/ui/CheckboxInput";
import FilterButton from "./FilterButton";
import { RootState } from "@reducers/index";
import { PerimeterRole } from "@custom-types/wecount-api/auth";

import { UserDataFilterName } from "@reducers/filters/filtersReducer";
import { setUserdataFilter } from "@actions/filters/filtersAction";

import useUserHasPerimeterRole from "@hooks/core/perimeterAccessControl/useUserHasPerimeterRole";

import styles from "@styles/filters/filterTopBar.module.scss";
import { upperFirst } from "lodash";
import { t } from "i18next";

interface Props {
  activeFilterNumber: number;
  onClickFilterButton: () => void;
  rightControls?: JSX.Element;
  myDataFilterName?: UserDataFilterName;

  children: JSX.Element | JSX.Element[];
}

const FilterTopBar = ({
  activeFilterNumber,
  onClickFilterButton,
  rightControls,
  myDataFilterName,
  children,
}: Props) => {
  const dispatch = useDispatch();

  const isCollaborator = useUserHasPerimeterRole(PerimeterRole.PERIMETER_COLLABORATOR);

  const isMyDataButtonChecked = useSelector<RootState, boolean>(state =>
    myDataFilterName == null
      ? false
      : state.filters[myDataFilterName].userId !== null
  );

  const currentUserId = useSelector<RootState, number | null>(
    state => state.auth.id ?? null
  );

  return (
    <TopBar>
      <div className={styles.filterTopBar}>
        <div className={styles.left}>
          {myDataFilterName != null && (
            /* For a contributor, the checkbox is always checked, and clicking on it has no action, because the spec requires it */
            <Checkbox
              className={cx({[styles.disabledCheckbox]: !isCollaborator})}
              checked={!isCollaborator || isMyDataButtonChecked}
              onChange={checked => {
                if (currentUserId != null && isCollaborator) {
                  dispatch(
                    setUserdataFilter({
                      filterName: myDataFilterName,
                      userId: checked ? currentUserId : null,
                    })
                  );
                }
              }}
              id="my-data"
            >
              {upperFirst(t("global.data.myData"))}
            </Checkbox>
          )}
        </div>
        <div className={styles.activeFilterBadgeContainer}>{children}</div>
        <div
          className={cx(styles.right, {
            [styles.lonelyChild]: rightControls == null,
          })}
        >
          <FilterButton
            filterNumber={activeFilterNumber}
            onClick={onClickFilterButton}
          />
          {rightControls != null && <div className={styles.separator}></div>}
          {rightControls}
        </div>
      </div>
    </TopBar>
  );
};

export default FilterTopBar;
