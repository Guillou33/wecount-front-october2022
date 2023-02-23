import cx from "classnames";
import styles from "@styles/dashboard/campaign/sub/overviewTable.module.scss";
import { Scope } from "@custom-types/wecount-api/activity";
import { convertToTons, percentageCalculator } from "@lib/utils/calculator";
import { formatNumberWithLanguage } from "@lib/translation/config/numbers";
import { reformatConvertToTons } from "@lib/core/campaign/getEmissionNumbers";

interface TableRowProps {
  categorySpan: number;
  categoryData: {
    id: number;
    name: string;
    scope: Scope;
  };
  activityData: {
    name: string;
    resultTco2: number;
    entityResults: {
      [key: number]: number;
    };
  };
  resultTco2Total: number;
  entityIdsToShow: number[];
  firstColumnWidth: number;
}

const OverviewTableRow = ({
  categorySpan,
  categoryData,
  activityData,
  resultTco2Total,
  entityIdsToShow,
  firstColumnWidth,
}: TableRowProps) => {
  const cellScope = styles[categoryData.scope.toLowerCase()];
  const percentOfTotal = percentageCalculator(resultTco2Total);

  return (
    <tr className={cx(styles.overviewTableRow)}>
      {categorySpan > 0 && (
        <td
          rowSpan={categorySpan}
          className={cx(styles.categoryCell, styles.stickyColumn, cellScope)}
        >
          {categoryData.name}
        </td>
      )}
      <td
        className={cx(cellScope, styles.stickyColumn)}
        style={{ left: firstColumnWidth }}
      >
        {activityData.name}
      </td>
      {entityIdsToShow.map(entityId => (
        <td
          key={entityId}
          className={cx(cellScope, "text-center", "text-nowrap")}
        >
          <b>{reformatConvertToTons(activityData.entityResults?.[entityId] ?? 0)}</b> t
        </td>
      ))}
      <td className={cx(cellScope, "text-center", "text-nowrap")}>
        <b>{reformatConvertToTons(activityData.resultTco2)}</b> t
      </td>
      <td className={cx(cellScope, "text-center", "text-nowrap")}>
        <b>{formatNumberWithLanguage(percentOfTotal(activityData.resultTco2))}</b> %
      </td>
    </tr>
  );
};

export default OverviewTableRow;
