import upperFirst from "lodash/upperFirst";
import { t } from "i18next";
import { useSelector } from "react-redux";
import merge from "lodash/fp/merge";
import ReactEChart from "@components/helpers/echarts/ReactEChart";
import EChartSizer from "@components/helpers/echarts/EChartSizer";
import { EChartsOption } from "echarts";

import { RootState } from "@reducers/index";

import memoValue from "@lib/utils/memoValue";
import useActivityModelInfo from "@hooks/core/useActivityModelInfo";
import useAllEntriesInfoTotal from "@hooks/core/activityEntryInfo/useAllEntriesInfoTotal";

import selectActivityEntriesOfCampaignIdList from "@selectors/activityEntries/selectActivityEntriesOfCampaignIdList";
import selectFilteredEntriesOfMultipleCampaignsForAnalysis from "@selectors/activityEntries/selectFilteredEntriesOfMultipleCampaignsForAnalysis";
import getCampaignResultsDiff, {
  Result,
} from "@components/dashboard/campaign/sub/ComparisonCharts/helpers/getCampaignResultsDiff";
import sortResults from "@components/dashboard/campaign/sub/ComparisonCharts/helpers/sortResults";
import convertResult from "@components/dashboard/campaign/sub/ComparisonCharts/helpers/convertResult";
import chartOptions from "@components/dashboard/campaign/sub/ComparisonCharts/helpers/chartOptions";
import getSeries from "@components/dashboard/campaign/sub/ComparisonCharts/helpers/getSeries";

import selectCampaignsInfoByActivityModel from "@selectors/activityEntryInfoByCampaigns/selectCampaignsInfoByActivityModel";

import styles from "@styles/dashboard/campaign/sub/comparisonCharts/activitymodelComparison.module.scss";

interface Props {
  campaignId: number;
  campaignToCompareId: number;
  activityModelIds: number[];
}

const ActivitymodelComparison = ({
  campaignId,
  campaignToCompareId,
  activityModelIds,
}: Props) => {
  const campaignName = useSelector(
    (state: RootState) =>
      state.campaign.campaigns[campaignId]?.information?.name
  );
  const activityModelInfo = useActivityModelInfo();
  const tco2Total = useAllEntriesInfoTotal(campaignId).tCo2;

  const campaignIdList = memoValue(
    [campaignId, campaignToCompareId].filter(id => !isNaN(id))
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
  const campaignsInfoByActivityModel = useSelector((state: RootState) =>
    selectCampaignsInfoByActivityModel(state, filteredEntriesOfCampaigns)
  );

  const diff = getCampaignResultsDiff(
    campaignsInfoByActivityModel[campaignId],
    campaignsInfoByActivityModel[campaignToCompareId]
  );

  const diffOfActivityModelSelection = activityModelIds.reduce((acc, id) => {
    const activityModelDiff = diff[id];
    if (activityModelDiff != null) {
      acc.push(activityModelDiff);
    }
    return acc;
  }, [] as Result[]);

  const sortedResult = diffOfActivityModelSelection
    .sort(sortResults)
    .map(convertResult);

  const options: EChartsOption = {
    series: getSeries(sortedResult, tco2Total, campaignName),
    yAxis: {
      data: sortedResult.map(({ id }) => activityModelInfo[Number(id)]?.name),
    },
  };
  return sortedResult.length > 0 ? (
    <EChartSizer numberOfElement={sortedResult.length}>
      <ReactEChart option={merge(chartOptions, options)} resizeOnChange />
    </EChartSizer>
  ) : (
    <p className={styles.noResults}>
      {upperFirst(
        t("dashboard.activityComparisonChart.noResults", {
          count: activityModelIds.length,
        })
      )}
    </p>
  );
};

export default ActivitymodelComparison;
