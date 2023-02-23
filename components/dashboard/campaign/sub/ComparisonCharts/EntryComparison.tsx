import { useSelector } from "react-redux";
import ReactEChart from "@components/helpers/echarts/ReactEChart";
import EChartSizer from "@components/helpers/echarts/EChartSizer";
import { BarSeriesOption, EChartsOption } from "echarts";
import merge from "lodash/fp/merge";
import chartOptions from "@components/dashboard/campaign/sub/ComparisonCharts/helpers/chartOptions";
import { t } from "i18next";

import selectActivityEntriesOfCampaignIdList from "@selectors/activityEntries/selectActivityEntriesOfCampaignIdList";
import selectFilteredEntriesOfMultipleCampaignsForAnalysis from "@selectors/activityEntries/selectFilteredEntriesOfMultipleCampaignsForAnalysis";

import memoValue from "@lib/utils/memoValue";
import getHistoryFromEntries from "@lib/core/campaignHistory/getHistoryFromEntries";
import entryComparisonSeriesBuilder from "@components/dashboard/campaign/sub/ComparisonCharts/helpers/entryComparisonSeriesBuilder";
import getEfName from "@components/dashboard/campaign/sub/ComparisonCharts/helpers/getEfName";
import { reformatConvertToTons } from "@lib/core/campaign/getEmissionNumbers";

import { RootState } from "@reducers/index";

import styles from "@styles/dashboard/campaign/sub/comparisonCharts/entryComparisonChart.module.scss";

interface Props {
  campaignId: number;
  campaignToCompareId: number;
  excludedEntryHistory: Record<string, true>;
  selectedActivityModelId: number;
}

const EntryComparison = ({
  campaignId,
  campaignToCompareId,
  excludedEntryHistory,
  selectedActivityModelId,
}: Props) => {
  const campaignIdList = memoValue([campaignId, campaignToCompareId]);
  const campaignOneName = useSelector(
    (state: RootState) =>
      state.campaign.campaigns[campaignId]?.information?.name
  );
  const campaignTwoName = useSelector(
    (state: RootState) =>
      state.campaign.campaigns[campaignToCompareId]?.information?.name
  );

  const entriesOfCampaigns = useSelector((state: RootState) =>
    selectActivityEntriesOfCampaignIdList(state, campaignIdList)
  );

  const filteredEntriesOfCampaigns = useSelector((state: RootState) =>
    selectFilteredEntriesOfMultipleCampaignsForAnalysis(
      state,
      entriesOfCampaigns
    )
  );
  const comparisonHistory = getHistoryFromEntries(filteredEntriesOfCampaigns);
  const filteredComparison = Object.values(comparisonHistory).filter(
    history =>
      !excludedEntryHistory[history.referenceId] &&
      (history.entriesBycampaignId[campaignId]?.activityModelId ===
        selectedActivityModelId ||
        history.entriesBycampaignId[campaignToCompareId]?.activityModelId ===
          selectedActivityModelId)
  );

  const sortedComparisonHistory = filteredComparison.sort(
    (historyA, historyB) => {
      const historyACampaign1result =
        historyA.entriesBycampaignId[campaignId]?.resultTco2 ?? 0;
      const historyACampaign2result =
        historyA.entriesBycampaignId[campaignToCompareId]?.resultTco2 ?? 0;
      const historyBCampaign1result =
        historyB.entriesBycampaignId[campaignId]?.resultTco2 ?? 0;
      const historyBCampaign2result =
        historyB.entriesBycampaignId[campaignToCompareId]?.resultTco2 ?? 0;

      if (historyACampaign1result === 0 && historyBCampaign1result === 0) {
        return historyACampaign2result - historyBCampaign2result;
      }
      return historyACampaign1result - historyBCampaign1result;
    }
  );

  const efNames = sortedComparisonHistory.map(
    ({ referenceId, entriesBycampaignId }) => {
      const efCampaign1 = getEfName(entriesBycampaignId[campaignId]);
      const efCampaign2 = getEfName(entriesBycampaignId[campaignToCompareId]);

      return {
        referenceId,
        efCampaign1,
        efCampaign2,
      };
    }
  );

  const buildSerie = entryComparisonSeriesBuilder({
    comparisonHistory: sortedComparisonHistory,
    efNames,
    campaign1Id: campaignId,
  });

  const series: BarSeriesOption[] = [
    buildSerie(campaignId),
    buildSerie(campaignToCompareId),
  ];

  const options: EChartsOption = {
    series,
    yAxis: {
      data: efNames.map(({ efCampaign1, efCampaign2, referenceId }) => {
        const name =
          efCampaign1 === efCampaign2
            ? efCampaign1
            : `${efCampaign1}\n${efCampaign2}`;

        return `${referenceId}\n${name}`;
      }),
      axisLabel: {
        show: true,
      },
    },
    xAxis: {
      nameLocation: "middle",
    },
    grid: {
      containLabel: true,
    },
  };

  const [campaignOneTotal, campaignTwoTotal] = sortedComparisonHistory.reduce(
    (acc, historyOfEntries) => {
      acc[0] +=
        historyOfEntries.entriesBycampaignId[campaignId]?.resultTco2 ?? 0;
      acc[1] +=
        historyOfEntries.entriesBycampaignId[campaignToCompareId]?.resultTco2 ??
        0;
      return acc;
    },
    [0, 0] as [number, number]
  );

  return (
    <>
      <div className={styles.totals}>
        <div className={styles.campaignOneTotal}>
          {campaignOneName} :{" "}
          <span className="title-2">
            {reformatConvertToTons(campaignOneTotal)}{" "}
            {t("footprint.emission.tco2.tco2e")}
          </span>
        </div>
        <div className={styles.campaignTwoTotal}>
          {campaignTwoName} :{" "}
          <span className="title-2">
            {reformatConvertToTons(campaignTwoTotal)}{" "}
            {t("footprint.emission.tco2.tco2e")}
          </span>
        </div>
      </div>
      <EChartSizer
        numberOfElement={filteredComparison.length}
        elementHeight={75}
      >
        <ReactEChart option={merge(chartOptions, options)} resizeOnChange />
      </EChartSizer>
    </>
  );
};

export default EntryComparison;
