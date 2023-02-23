import cx from "classnames";
import fileDownload from "js-file-download";
import { useSelector } from "react-redux";

import { getSelectResultsByReglementationSubCategory } from "@selectors/reglementationTables/selectResultsByReglementationSubCategory";
import { getSelectResultsByReglementationCategory } from "@selectors/reglementationTables/selectResultsByReglementationCategory";
import { getSelectResultsForReglementationTable } from "@selectors/reglementationTables/selectResultsForReglementationTable";

import { RootState } from "@reducers/index";
import { ReglementationTable as ReglementationTableType } from "@lib/wecount-api/responses/apiResponses";
import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";
import { UnitMode } from "./ReglementationTable";
import { Column, columnLabels, getTco2ForColumn } from "./helpers/columns";
import counter from "@lib/utils/counter";
import formatResult from "./helpers/formatResult";

import styles from "@styles/dashboard/campaign/sub/reglementationTable.module.scss";
import { upperFirst } from "lodash";
import { t } from "i18next";

interface Props {
  entries: ActivityEntryExtended[];
  type: "BEGES" | "GHG" | "ISO";
  columns: Column[];
  unitMode?: UnitMode;
  indexLinesByCategory?: boolean;
  enumrateCategories?: boolean;
}

const DownloadButton = ({
  entries,
  type,
  columns,
  unitMode = "t",
  enumrateCategories = false,
  indexLinesByCategory = false,
}: Props) => {
  const campaignId = useSelector(
    (state: RootState) => state.campaign.currentCampaign
  );
  const structure = useSelector<RootState, ReglementationTableType | undefined>(
    state => state.reglementationTables.structure[type]
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

  const downloadCsv = () => {
    if (structure == null) {
      return;
    }
    const countLine = counter(1);

    const tableHeaderCsv =
      (type === "GHG"
        ? `${upperFirst(
            t("footprint.emission.emissionCategories")
          )};${upperFirst(t("global.common.numbers"))};${upperFirst(
            t("footprint.emission.emissionStations")
          )};`
        : ";;;") +
      columns
        .map(
          column =>
            `${columnLabels[column]} (${
              column === "uncertainty" ? "t" : unitMode
            } CO2e)`
        )
        .join(";");

    const tableRows: (string | number)[][] = [];

    structure.reglementationCategories.forEach(
      (reglementationCategory, categoryIndex) => {
        reglementationCategory.reglementationSubCategories.forEach(
          (reglementationSubCategory, subCategoryIndex) => {
            const categoryLabel =
              (enumrateCategories ? `${categoryIndex + 1}.` : "") +
              ` ${reglementationCategory.name}`;

            const rowNumber = indexLinesByCategory
              ? `${categoryIndex + 1}.${subCategoryIndex + 1}`
              : countLine.next().value;

            const results = columns.map(column =>
              formatResult(
                getTco2ForColumn(
                  column,
                  reglementationTotalsBySubCategory[
                    reglementationSubCategory.id
                  ]
                ),
                unitMode,
                column
              )
            );

            tableRows.push([
              subCategoryIndex === 0 ? categoryLabel : "",
              rowNumber.toString(),
              reglementationSubCategory.name,
              ...results,
            ]);
          }
        );
        const subTotals = columns.map(column =>
          formatResult(
            getTco2ForColumn(
              column,
              reglementationTotalsByCategory[reglementationCategory.id]
            ),
            unitMode,
            column
          )
        );
        tableRows.push([
          "",
          "",
          upperFirst(t("global.common.subTotal")),
          ...subTotals,
        ]);
      }
    );
    const totals = columns.map(column =>
      formatResult(
        getTco2ForColumn(column, reglementationTotalsByTable),
        unitMode,
        column
      )
    );

    tableRows.push(["", "", upperFirst(t("global.common.total")), ...totals]);

    const rowCsv = tableRows.map(line => line.join(";")).join("\r\n");

    const csvData = tableHeaderCsv + "\r\n" + rowCsv;

    const date = new Date();
    const csvName = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}_${t("global.common.table")}_${t(
      "reglementation.reglementation"
    )}_${type}.csv`;

    fileDownload(csvData, csvName);
  };

  return (
    <button
      className={cx("button-1", styles.downloadButton)}
      onClick={downloadCsv}
    >
      <i className="fas fa-download"></i>
    </button>
  );
};

export default DownloadButton;
