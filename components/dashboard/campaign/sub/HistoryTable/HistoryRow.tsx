import cx from "classnames";
import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";

import getEntryData from "./helpers/getEntryData";

import Highlight from "@components/helpers/Highlight";

import ValueCell from "./ValueCell";
import ResultCell from "./ResultCell";
import EvolutionCell from "./EvolutionCell";

import styles from "@styles/dashboard/campaign/sub/historyTable/historyRow.module.scss";

type ColumnOffsets = {
  secondColumnOffset: number;
  thirdColumnOffset: number;
  fourthColumnOffset: number;
  fifthColumnOffset: number;
  sixthColumnOffset: number;
};

interface Props {
  categoryName: string;
  activityModelName: string;
  siteName: string | null;
  productName: string | null;
  referenceId: string;
  campaign1Entry: ActivityEntryExtended | null;
  campaign2Entry: ActivityEntryExtended | null;
  searchHistory?: string;
  columnOffsets: ColumnOffsets;
  isScolledLeft: boolean;
}

const HistoryRow = ({
  categoryName,
  activityModelName,
  referenceId,
  siteName,
  productName,
  campaign1Entry,
  campaign2Entry,
  searchHistory = "",
  columnOffsets,
  isScolledLeft,
}: Props) => {
  const entryData1 = getEntryData(campaign1Entry);
  const entryData2 = getEntryData(campaign2Entry);

  const emissionFactor =
    campaign1Entry?.emissionFactor?.name ??
    campaign2Entry?.emissionFactor?.name ??
    "";

  const {
    secondColumnOffset,
    thirdColumnOffset,
    fourthColumnOffset,
    fifthColumnOffset,
    sixthColumnOffset,
  } = columnOffsets;

  return (
    <tr className={styles.historyRow}>
      <td className={styles.stickyColumn}>
        <Highlight search={searchHistory}>{categoryName}</Highlight>
      </td>
      <td className={styles.stickyColumn} style={{ left: secondColumnOffset }}>
        <Highlight search={searchHistory}>{activityModelName}</Highlight>
      </td>
      <td
        className={cx("text-nowrap", styles.stickyColumn)}
        style={{ left: thirdColumnOffset }}
      >
        <Highlight search={searchHistory}>{referenceId}</Highlight>
      </td>
      <td className={styles.stickyColumn} style={{ left: fourthColumnOffset }}>
        <Highlight search={searchHistory}>{emissionFactor}</Highlight>
      </td>
      <td
        className={cx(styles.stickyColumn, {
          ["text-center"]: siteName == null,
        })}
        style={{ left: fifthColumnOffset }}
      >
        {siteName ?? "-"}
      </td>
      <td
        className={cx(styles.stickyColumn, {
          ["text-center"]: productName == null,
          [styles.shadowed]: isScolledLeft,
        })}
        style={{ left: sixthColumnOffset }}
      >
        {productName ?? "-"}
      </td>
      <ValueCell
        className={cx("text-nowrap text-center", styles.currentCampaign)}
        unit={entryData1.unit1}
      >
        {entryData1.value1}
      </ValueCell>
      <ValueCell
        className={cx("text-nowrap text-center", styles.compareToCampaign)}
        unit={entryData2.unit1}
      >
        {entryData2.value1}
      </ValueCell>
      <EvolutionCell
        className="text-nowrap text-center"
        value1={entryData1.value1}
        value2={entryData2.value1}
      />
      <ValueCell
        className={cx("text-nowrap text-center", styles.currentCampaign)}
        unit={entryData1.unit2}
      >
        {entryData1.value2}
      </ValueCell>
      <ValueCell
        className={cx("text-nowrap text-center", styles.compareToCampaign)}
        unit={entryData2.unit2}
      >
        {entryData2.value2}
      </ValueCell>
      <EvolutionCell
        className="text-nowrap text-center"
        value1={entryData1.value2}
        value2={entryData2.value2}
      />
      <ResultCell
        className={cx("text-nowrap text-center", styles.currentCampaign)}
      >
        {entryData1.resultTco2}
      </ResultCell>
      <ResultCell
        className={cx("text-nowrap text-center", styles.compareToCampaign)}
      >
        {entryData2.resultTco2}
      </ResultCell>
      <EvolutionCell
        className="text-nowrap text-center"
        value1={entryData1.resultTco2}
        value2={entryData2.resultTco2}
      />
    </tr>
  );
};

export default HistoryRow;
