import { useSelector } from "react-redux";
import cx from "classnames";

import { RootState } from "@reducers/index";
import {
  ReglementationTable as ReglementationTableType,
  TableType,
} from "@lib/wecount-api/responses/apiResponses";
import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";
import { Column, columnLabels, getTco2ForColumn } from "./helpers/columns";

import useElementDimensions from "@hooks/utils/useElementDimensions";
import counter from "@lib/utils/counter";

import { getSelectResultsByReglementationSubCategory } from "@selectors/reglementationTables/selectResultsByReglementationSubCategory";
import { getSelectResultsByReglementationCategory } from "@selectors/reglementationTables/selectResultsByReglementationCategory";
import { getSelectResultsForReglementationTable } from "@selectors/reglementationTables/selectResultsForReglementationTable";

import ResultCell from "./ResultCell";

import styles from "@styles/dashboard/campaign/sub/reglementationTable.module.scss";
import { upperFirst } from "lodash";
import { t } from "i18next";

export type UnitMode = "t" | "kg";

interface Props {
  entries: ActivityEntryExtended[];
  type: TableType;
  columns: Column[];
  unitMode?: UnitMode;
  indexLinesByCategory?: boolean;
  enumrateCategories?: boolean;
}

const ReglementationTable = ({
  entries,
  type,
  columns,
  unitMode = "t",
  indexLinesByCategory = false,
  enumrateCategories = false,
}: Props) => {
  const structure = useSelector<RootState, ReglementationTableType | undefined>(
    state => state.reglementationTables.structure[type]
  );

  const campaignId = useSelector(
    (state: RootState) => state.campaign.currentCampaign
  );

  const isLoadingData = useSelector((state: RootState) =>
    campaignId == null
      ? false
      : state.reglementationTables.dataByCampaign[campaignId]?.[type]
          ?.isFetching
  );

  const selectResultsBySubCategory =
    getSelectResultsByReglementationSubCategory(type);
  const selectResultsByCategory =
    getSelectResultsByReglementationCategory(type);
  const selectResultsForReglementationTable =
    getSelectResultsForReglementationTable(type);

  const reglementationTotalsBySubCategory = useSelector((state: RootState) =>
    selectResultsBySubCategory(state, entries, campaignId)
  );
  const reglementationTotalsByCategory = useSelector((state: RootState) =>
    selectResultsByCategory(state, entries, campaignId)
  );
  const reglementationTotalsByTable = useSelector((state: RootState) =>
    selectResultsForReglementationTable(state, entries, campaignId)
  );

  const [firstColumnRef, { width: firstColumnWidth }] = useElementDimensions();
  const [secondColumnRef, { width: secondColumnWidth }] =
    useElementDimensions();
  const thirdColumnOffset = firstColumnWidth + secondColumnWidth;

  const countLine = counter(1);

  const getUnitMode = (column: Column) =>
    column === "uncertainty" ? "t" : unitMode;

  if (structure == null || isLoadingData) {
    return (
      <div className="d-flex mt-5 align-items-center">
        <div className="spinner-border text-secondary mr-3"></div>
        <div>{upperFirst(t("global.data.loadingData"))}...</div>
      </div>
    );
  }
  return (
    <div className={styles.tableWrapper}>
      <table className={cx("wecount-table", styles.reglementationTable)}>
        <thead>
          <tr>
            <th
              className={cx(styles.stickyHeader, styles.onTop)}
              ref={firstColumnRef}
            ></th>
            <th
              className={cx(styles.stickyHeader, styles.onTop)}
              ref={secondColumnRef}
              style={{ left: firstColumnWidth }}
            ></th>
            <th
              className={cx(styles.stickyHeader, styles.onTop)}
              style={{ left: thirdColumnOffset }}
            ></th>
            {columns.map(column => (
              <th
                key={column}
                className={cx(styles.stickyHeader, "text-center")}
              >
                {columnLabels[column]} ({getUnitMode(column)}&nbsp;CO2e)
              </th>
            ))}
          </tr>
        </thead>
        {structure.reglementationCategories.map((category, categoryIndex) => (
          <tbody key={categoryIndex} className={cx(styles.categoryTable)}>
            {category.reglementationSubCategories.map(
              (subcategory, subcategoryIndex, subcategories) => (
                <tr key={subcategoryIndex}>
                  {subcategoryIndex === 0 && (
                    <td
                      rowSpan={subcategories.length + 1}
                      className={cx(
                        styles.categoryName,
                        styles.stickyColumn,
                        "text-nowrap"
                      )}
                    >
                      {enumrateCategories
                        ? `${categoryIndex + 1}. ${category.name}`
                        : category.name}
                    </td>
                  )}
                  <td
                    className={styles.stickyColumn}
                    style={{ left: firstColumnWidth }}
                  >
                    {indexLinesByCategory
                      ? `${categoryIndex + 1}.${subcategoryIndex + 1}`
                      : countLine.next().value}
                  </td>
                  <td
                    className={styles.stickyColumn}
                    style={{ left: thirdColumnOffset }}
                  >
                    {subcategory.name}
                  </td>
                  {columns.map(column => {
                    return (
                      <ResultCell
                        unitMode={getUnitMode(column)}
                        key={column}
                        bold={column === "result"}
                      >
                        {getTco2ForColumn(
                          column,
                          reglementationTotalsBySubCategory[subcategory.id]
                        )}
                      </ResultCell>
                    );
                  })}
                </tr>
              )
            )}
            <tr className={cx(styles.subTotalRow)}>
              <td
                colSpan={2}
                className={cx(styles.stickyColumn, "text-right")}
                style={{ left: firstColumnWidth }}
              >
                <b>{upperFirst(t("global.common.subTotal"))}</b>
              </td>
              {columns.map(column => {
                return (
                  <ResultCell unitMode={getUnitMode(column)} key={column} bold>
                    {getTco2ForColumn(
                      column,
                      reglementationTotalsByCategory[category.id]
                    )}
                  </ResultCell>
                );
              })}
            </tr>
          </tbody>
        ))}
        <tbody>
          <tr>
            <td colSpan={3} className={cx(styles.stickyColumn, "text-right")}>
              <b>{upperFirst(t("global.common.total"))}</b>
            </td>
            {columns.map(column => {
              return (
                <ResultCell unitMode={getUnitMode(column)} bold key={column}>
                  {getTco2ForColumn(column, reglementationTotalsByTable)}
                </ResultCell>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ReglementationTable;
