import { useSelector } from "react-redux";
import { BarSeriesOption, EChartsOption } from "echarts";
import merge from "lodash/fp/merge";
import upperFirst from "lodash/upperFirst";
import { t } from "i18next";

import { RootState } from "@reducers/index";
import { CampaignType } from "@custom-types/core/CampaignType";
import ReactEChart from "@components/helpers/echarts/ReactEChart";
import {
  WaterfallDataName,
  waterfallDataNames,
} from "@hooks/core/waterfall/helpers/waterfallData";
import baseOptions from "@components/helpers/echarts/baseOptions";
import {
  augmentationColor,
  reductionColor,
  reductionColorDarker,
} from "@components/dashboard/campaign/sub/ComparisonCharts/helpers/chartColors";
import { wecountFormat } from "@lib/core/campaign/getEmissionNumbers";
import memoValue from "@lib/utils/memoValue";

import { makeSelectFilteredActivityEntriesForAnalysis } from "@selectors/activityEntries/selectFilteredActivityEntriesForAnalysis";
import { makeSelectEntryInfoTotal } from "@selectors/activityEntryInfo/selectEntryInfoTotal";
import selectWaterfallData from "@selectors/waterfall/selectWaterfallData";
import selectActivityEntriesOfCampaignIdList from "@selectors/activityEntries/selectActivityEntriesOfCampaignIdList";

import getChartData from "./helpers/getChartData";
import { isReduction, previousAxis } from "./helpers/config";

const selectEntriesOfCampaign1 = makeSelectFilteredActivityEntriesForAnalysis();
const selectEntriesOfCampaign2 = makeSelectFilteredActivityEntriesForAnalysis();

const selectTotalOfCampaign1 = makeSelectEntryInfoTotal();
const selectTotalOfCampaign2 = makeSelectEntryInfoTotal();

const campaignResultsColor = "#1b2668";

interface Props {
  campaignId1: number;
  campaignId2: number;
  onDataClick?: (value: WaterfallDataName) => void;
}

const Waterfall = ({ campaignId1, campaignId2, onDataClick }: Props) => {
  const campaignIds = memoValue([campaignId1, campaignId2] as [number, number]);
  const entriesOfCampaigns = useSelector((state: RootState) =>
    selectActivityEntriesOfCampaignIdList(state, campaignIds)
  );
  const waterfallData = useSelector((state: RootState) =>
    selectWaterfallData(state, campaignIds, entriesOfCampaigns)
  );

  const campaign1Year = useSelector(
    (state: RootState) =>
      state.campaign.campaigns[campaignId1]?.information?.year
  );
  const campaign2Year = useSelector(
    (state: RootState) =>
      state.campaign.campaigns[campaignId2]?.information?.year
  );
  const campaign1Type = useSelector(
    (state: RootState) =>
      state.campaign.campaigns[campaignId1]?.information?.type
  );
  const campaign2Type = useSelector(
    (state: RootState) =>
      state.campaign.campaigns[campaignId2]?.information?.type
  );
  const isSameYear = campaign1Year === campaign2Year;

  const entriesOfCampaign1 = useSelector((state: RootState) =>
    selectEntriesOfCampaign1(state, campaignId1)
  );
  const campaign1InfoTotal = useSelector((state: RootState) =>
    selectTotalOfCampaign1(state, entriesOfCampaign1)
  );

  const entriesOfCampaign2 = useSelector((state: RootState) =>
    selectEntriesOfCampaign2(state, campaignId2)
  );
  const campaign2InfoTotal = useSelector((state: RootState) =>
    selectTotalOfCampaign2(state, entriesOfCampaign2)
  );

  const data = getChartData(waterfallData);

  const series: BarSeriesOption[] = [
    {
      type: "bar",
      stack: "main",
      color: "transparent",
      name: "to be ignored",
      silent: true,
      data: [
        0,
        ...data.map(({ key }) => {
          const placeholderTotal = previousAxis[key].reduce((acc, axis) => {
            const axisValue = waterfallData[axis];
            return isReduction[axis] ? acc - axisValue : acc + axisValue;
          }, campaign1InfoTotal.tCo2);
          return (
            (isReduction[key]
              ? placeholderTotal - waterfallData[key]
              : placeholderTotal) / 1000
          );
        }),
        0,
      ],
    },
    {
      type: "bar",
      stack: "main",
      data: [
        {
          value: campaign1InfoTotal.tCo2 / 1000,
          itemStyle: { color: campaignResultsColor },
          label: {
            color: campaignResultsColor,
          },
        },
        ...data.map(
          ({ key, value }) =>
            ({
              value: value / 1000,
              itemStyle: {
                color: isReduction[key] ? reductionColor : augmentationColor,
              },
              label: {
                color: isReduction[key]
                  ? reductionColorDarker
                  : augmentationColor,
                formatter: ({ value }) =>
                  `${isReduction[key] ? "-" : "+"}${wecountFormat(
                    Number(value)
                  )}`,
                position: isReduction[key] ? "bottom" : "top",
              },
              waterfallDataName: key,
            } as BarSeriesOption)
        ),
        {
          value: campaign2InfoTotal.tCo2 / 1000,
          itemStyle: { color: campaignResultsColor },
          label: {
            color: campaignResultsColor,
          },
        },
      ],
      label: {
        show: true,
        position: "top",
        fontWeight: "bold",
        formatter: ({ value }) => wecountFormat(Number(value)),
      },
      tooltip: {
        valueFormatter: value =>
          `${wecountFormat(Number(value))} ${t(
            "footprint.emission.tco2.tco2e"
          )}`,
      },
    },
  ];

  const axisLabels = data.map(({ key }) =>
    upperFirst(
      t(`dashboard.waterfall.axisLabels.${key}`, { year: campaign1Year })
    )
  );

  const options: EChartsOption = {
    series,
    xAxis: {
      data: [
        `${
          isSameYear && campaign1Type === CampaignType.SIMULATION
            ? upperFirst(
                t("footprint.simulationOfYear", { year: campaign1Year })
              )
            : campaign1Year?.toString()
        }`,
        ...axisLabels,
        `${
          isSameYear && campaign2Type === CampaignType.SIMULATION
            ? upperFirst(
                t("footprint.simulationOfYear", { year: campaign2Year })
              )
            : campaign2Year?.toString()
        }`,
      ],
      show: true,
      type: "category",
      axisLabel: {
        width: 110,
        interval: 0,
        // @ts-ignore
        overflow: "break",
        fontSize: 15,
      },
    },
    grid: {
      containLabel: true,
    },
    toolbox: {
      feature: {
        dataZoom: {
          filterMode: "weakFilter",
        },
      },
    },
  };

  return (
    <ReactEChart
      option={merge(baseOptions, options)}
      onEvents={[
        {
          eventName: "click",
          handler: e => {
            if (onDataClick) {
              const clicked = e?.data?.waterfallDataName ?? "";
              if (waterfallDataNames.includes(clicked)) {
                onDataClick(clicked);
              }
            }
          },
        },
      ]}
    />
  );
};

export default Waterfall;
