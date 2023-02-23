import React from "react";
import Checkbox from "@components/helpers/ui/CheckboxInput";
import cx from 'classnames';
import styles from "@styles/filters/filterTopBar.module.scss";
import { toggleExcludedPresence } from "@actions/filters/filtersAction";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@reducers/index";
import { ExcludedFilter, FilterNames } from "@reducers/filters/filtersReducer";
import { excludedOptions } from "@custom-types/core/ExcludedOptions";
import FilterElement from "./FilterElement";
import { upperFirst } from "lodash";
import { t } from "i18next";

const checkAllExcludedFilters = ({
  item,
  choice
}: {
  item: string,
  choice: number
}) => {
  if (item === "data-included") {
    return choice === 0 ? 1 : choice === 1 ? 0 : choice === 2 ? 3 : 2;
  }
  if (item === "data-excluded") {
    return choice === 0 ? 2 : choice === 2 ? 0 : choice === 1 ? 3 : 1;
  }
  return 0;
}

const FilterExcluded = () => {
  const dispatch = useDispatch();

  const isExcludedChecked = useSelector<RootState, ExcludedFilter>(
    state => state.filters.cartographyExcluded
  );
  const activeExcludedFilter = isExcludedChecked.excludedEntries;

  return (
    <FilterElement title={upperFirst(t("trajectory.trajectory"))}>
      <div className={cx(styles.dropdownExcluded)}>
        <Checkbox
          className={cx(styles.disabledCheckbox)}
          checked={isExcludedChecked.excludedEntries === 1 || isExcludedChecked.excludedEntries === 3}
          onChange={checked => {
            dispatch(
              toggleExcludedPresence({
                filterName: FilterNames.CARTOGRAPHY_EXCLUDED,
                excludedEntries:
                  checkAllExcludedFilters({
                    item: "data-included",
                    choice: activeExcludedFilter
                  })
              })
            );
          }}
          id="data-included"
        >
          <p className={cx(styles.dropdownExcludedLabel)}>{upperFirst(t("filter.trajectory.includedData"))}</p>
        </Checkbox>
        <br/>
        <Checkbox
          className={cx(styles.disabledCheckbox)}
          checked={isExcludedChecked.excludedEntries === 2 || isExcludedChecked.excludedEntries === 3}
          onChange={checked => {
            dispatch(
              toggleExcludedPresence({
                filterName: FilterNames.CARTOGRAPHY_EXCLUDED,
                excludedEntries:
                  checkAllExcludedFilters({
                    item: "data-excluded",
                    choice: activeExcludedFilter
                  })
              })
            );
          }}
          id="data-excluded"
        >
          <p className={cx(styles.dropdownExcludedLabel)}>{upperFirst(t("filter.trajectory.excludedData"))}</p>
        </Checkbox>
      </div>
    </FilterElement>
  )
}

export default FilterExcluded;