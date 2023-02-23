import { useSelector } from "react-redux";
import merge from "lodash/fp/merge";
import ReactEChart from "@components/helpers/echarts/ReactEChart";
import EChartSizer from "@components/helpers/echarts/EChartSizer";
import { EChartsOption } from "echarts";

import { RootState } from "@reducers/index";

import memoValue from "@lib/utils/memoValue";
import useCategoryInfo from "@hooks/core/useCategoryInfo";
import useAllEntriesInfoTotal from "@hooks/core/activityEntryInfo/useAllEntriesInfoTotal";

import selectActivityEntriesOfCampaignIdList from "@selectors/activityEntries/selectActivityEntriesOfCampaignIdList";
import selectFilteredEntriesOfMultipleCampaignsForAnalysis from "@selectors/activityEntries/selectFilteredEntriesOfMultipleCampaignsForAnalysis";
import getCampaignResultsDiff from "@components/dashboard/campaign/sub/ComparisonCharts/helpers/getCampaignResultsDiff";
import sortResults from "@components/dashboard/campaign/sub/ComparisonCharts/helpers/sortResults";
import convertResult from "@components/dashboard/campaign/sub/ComparisonCharts/helpers/convertResult";
import chartOptions from "@components/dashboard/campaign/sub/ComparisonCharts/helpers/chartOptions";
import getSeries from "@components/dashboard/campaign/sub/ComparisonCharts/helpers/getSeries";

import selectCampaignsInfoByCategory from "@selectors/activityEntryInfoByCampaigns/selectCampaignsInfoByCategory";

interface Props {
  campaignId: number;
  campaignToCompareId: number;
}

const CategoryComparison = ({ campaignId, campaignToCompareId }: Props) => {
  const campaignName = useSelector(
    (state: RootState) =>
      state.campaign.campaigns[campaignId]?.information?.name
  );
  const categoryInfo = useCategoryInfo();
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
  const campaignsInfoByCategory = useSelector((state: RootState) =>
    selectCampaignsInfoByCategory(state, filteredEntriesOfCampaigns)
  );

  const diff = getCampaignResultsDiff(
    campaignsInfoByCategory[campaignId],
    campaignsInfoByCategory[campaignToCompareId]
  );

  const sortedResult = Object.values(diff).sort(sortResults).map(convertResult);

  const options: EChartsOption = {
    series: getSeries(sortedResult, tco2Total, campaignName),
    yAxis: {
      data: sortedResult.map(({ id }) => categoryInfo[Number(id)]?.name),
    },
  };
  return (
    <EChartSizer numberOfElement={sortResults.length}>
      <ReactEChart option={merge(chartOptions, options)} />
    </EChartSizer>
  );
};

export default CategoryComparison;
