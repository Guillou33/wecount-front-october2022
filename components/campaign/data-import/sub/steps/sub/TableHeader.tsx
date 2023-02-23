import cx from "classnames";
import { upperFirst } from "lodash";
import { t } from "i18next";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import throttle from "lodash/throttle";

import { ColumnSetting } from "@lib/core/dataImport/columnConfig";
import { RootState } from "@reducers/index";

import selectFilteredEntryData from "@selectors/dataImport/filteredEntryData/selectFilteredEntryData";
import selectAllSelectedEntryData from "@selectors/dataImport/entryDataSelection/selectedEntryData/selectAllSelectedEntryData";
import {
  selectAll,
  unselectAll,
} from "@actions/dataImport/entryDataSelection/entryDataSelectionActions";
import selectActiveFilterNumber from "@selectors/dataImport/filteredEntryData/selectActiveFilterNumber";

import { resetDataFilters } from "@actions/dataImport/dataFilters/dataFiltersActions";

import Checkbox from "@components/helpers/ui/Checkbox";
import Dropdown from "@components/helpers/ui/dropdown/Dropdown";
import ColumnFilter from "@components/campaign/data-import/sub/data-filters/ColumnFilter";
import Foldable from "@components/helpers/form/Foldable";
import CustomTooltip from "@components/helpers/bootstrap/Tooltip";

import styles from "@styles/campaign/data-import/sub/steps/sub/tableHeader.module.scss";

interface Props {
  columns: ColumnSetting[];
  onColumnSettingsClick: () => void;
  renderMultiActions: (className: string) => JSX.Element;
}

const TableHeader = ({
  columns,
  onColumnSettingsClick,
  renderMultiActions,
}: Props) => {
  const dispatch = useDispatch();

  const selectedEntries = useSelector((state: RootState) =>
    selectAllSelectedEntryData(state)
  );
  const filteredEntries = useSelector((state: RootState) =>
    selectFilteredEntryData(state)
  );

  const areAllEntrySelected =
    selectedEntries.length === filteredEntries.length &&
    filteredEntries.length !== 0;
  const areAllEntryUnselected = selectedEntries.length === 0;
  const areEntriesPartiallySelected =
    !areAllEntrySelected && !areAllEntryUnselected;

  const [isSticked, setIsSticked] = useState(false);

  const conditionalShadow = {
    [styles.shadowed]: isSticked,
  };

  const headerRef = useRef<HTMLTableRowElement | null>(null);

  const [showSearch, setShowSearch] = useState(false);

  const activeFilterNumber = useSelector(selectActiveFilterNumber);

  useEffect(() => {
    const handleScroll = throttle(() => {
      if (headerRef.current != null) {
        const { top } = headerRef.current.getBoundingClientRect();
        setIsSticked(top === 0);
      }
    });

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <tr ref={headerRef} className={styles.headerRow}>
      <>
        <th
          className={cx(
            styles.buttonContainer,
            styles.multiActionButtons,
            conditionalShadow
          )}
        >
          <span className={styles.multiActionButtonWrapper}>
            <Checkbox
              checked={areAllEntrySelected}
              partiallyChecked={areEntriesPartiallySelected}
              id="checkbox-all-entries"
              onChange={() => {
                if (areAllEntryUnselected) {
                  dispatch(selectAll());
                } else {
                  dispatch(unselectAll());
                }
              }}
              className={styles.allEntriesCheckbox}
            />
            <Dropdown
              togglerContent={<i className="fas fa-ellipsis-v" />}
              disabled={areAllEntryUnselected}
              className={styles.multiActionDropdown}
            >
              {renderMultiActions(styles.actionButton)}
            </Dropdown>
          </span>
        </th>
        {columns.map(column => (
          <th
            key={column.entryDataKey}
            className={cx(conditionalShadow, styles.namedColumn)}
          >
            <span className={styles.name}>{upperFirst(t(column.name))}</span>
            <ColumnFilter
              isOpen={showSearch}
              entryDataKey={column.entryDataKey}
            />
          </th>
        ))}
        <th className={cx(styles.buttonContainer, conditionalShadow)}>
          <span className={styles.multiButtonsContainer}>
            <button
              className={cx("button-2", styles.tableHeaderButton)}
              onClick={() => setShowSearch(s => !s)}
            >
              <i className="fas fa-search"></i>
              {activeFilterNumber > 0 && (
                <div className={styles.badge}>
                  <div className={styles.content}>{activeFilterNumber}</div>
                </div>
              )}
            </button>
            <button
              className={cx("button-2", styles.tableHeaderButton)}
              onClick={onColumnSettingsClick}
            >
              <i className="fa fa-cog"></i>
            </button>
          </span>

          {activeFilterNumber > 0 && (
            <Foldable isOpen={showSearch}>
              <CustomTooltip
                content={upperFirst(
                  t("dataImport.dataFilters.eraseAllFilters")
                )}
                hideDelay={0}
                showDelay={0}
              >
                <button
                  onClick={() => dispatch(resetDataFilters())}
                  className={cx(
                    "button-2",
                    styles.tableHeaderButton,
                    styles.emptyFilters
                  )}
                >
                  <i className="fas fa-eraser"></i>
                </button>
              </CustomTooltip>
            </Foldable>
          )}
        </th>
      </>
    </tr>
  );
};

export default TableHeader;
