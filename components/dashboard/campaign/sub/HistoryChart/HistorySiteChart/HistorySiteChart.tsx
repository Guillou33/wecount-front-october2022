import { useState } from "react";
import { merge } from "lodash/fp";
import { range, upperFirst } from "lodash";
import { EChartsOption, SeriesOption } from "echarts";
import ReactEChart from "@components/helpers/echarts/ReactEChart";
import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";

import baseOptions, {
  defaultFontSize,
} from "@components/helpers/echarts/baseOptions";

import { defaultEndYear } from "../defaultEndYear";
import { HistoryOfEntries } from "@lib/core/campaignHistory/getHistoryFromEntries";
import { CampaignsYearSpan } from "@selectors/campaign/selectCampaignsYearSpan";
import { arrayProjection } from "@lib/utils/arrayProjection";
import { getPalette, Color } from "@lib/utils/hashColor";
import getEntryTooltip from "./helpers/getEntryTooltip";
import { convertToTons } from "@lib/utils/calculator";
import { t } from "i18next";
import { CampaignType } from "@custom-types/core/CampaignType";

interface Props {
  historyOfEntries: HistoryOfEntries;
  yearSpan: CampaignsYearSpan;
  siteName?: string;
  campaignTypes: Record<number, CampaignType>;
}

const HistorySiteChart = ({
  historyOfEntries,
  yearSpan,
  siteName = upperFirst(t("site.sites")),
  campaignTypes,
}: Props) => {
  const campaignIdsByYear = yearSpan.campaignIdsByYear;
  const endYear = Math.max(defaultEndYear, yearSpan.end);
  const years = range(yearSpan.start, endYear + 1);

  const [displayedHistory, setDisplayedHistory] = useState<
    Record<string, boolean>
  >(
    Object.keys(historyOfEntries).reduce((acc, referenceId) => {
      acc[referenceId] = true;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const firstResultByHistoryReference = Object.values(historyOfEntries).reduce(
    (acc, history) => {
      const firstResult = Object.values(history.entriesBycampaignId).find(
        entry => entry.resultTco2 != null
      );
      acc[history.referenceId] = firstResult?.resultTco2 ?? -Infinity;
      return acc;
    },
    {} as Record<string, number>
  );

  const tco2Totals = years.map(year => {
    const total = Object.values(historyOfEntries).reduce((acc, history) => {
      if (!displayedHistory[history.referenceId]) {
        return acc;
      }
      const campaignId = campaignIdsByYear[year];
      return acc + (history.entriesBycampaignId[campaignId]?.resultTco2 ?? 0);
    }, 0);
    return total;
  });

  const sortedHistoryOfEntries = Object.keys(historyOfEntries).sort((a, b) => {
    return firstResultByHistoryReference[b] - firstResultByHistoryReference[a];
  });

  const historyOfEntriesColor = arrayProjection(
    [...sortedHistoryOfEntries].reverse(),
    getPalette(Color.EMISSION_BLUE)
  );
  const historyOfEntriesSimulationColor = arrayProjection(
    [...sortedHistoryOfEntries].reverse(),
    getPalette(Color.PROJECTION_PURPLE)
  );

  const series: SeriesOption[] = sortedHistoryOfEntries.map(
    (historyId, index) => {
      const history = historyOfEntries[historyId];
      return {
        name: history.referenceId,
        stack: "tco2-result",
        type: "bar",
        data: years.map(year => {
          const campaignId = campaignIdsByYear[year];
          const entry = history.entriesBycampaignId[campaignId];
          const isSimulation =
            campaignTypes[campaignId] === CampaignType.SIMULATION;
          return {
            value: convertToTons(entry?.resultTco2 ?? 0),
            entry,
            itemStyle: {
              color: isSimulation
                ? historyOfEntriesSimulationColor[historyId]
                : historyOfEntriesColor[historyId],
              decal: {
                symbol: isSimulation ? "rect" : "none",
                dashArrayX: [1, 0],
                dashArrayY: [3, 4],
                rotation: -Math.PI / 4,
                color: "rgba(255, 255, 255, 0.25)",
              },
            },
          };
        }),

        label: {
          show: index === sortedHistoryOfEntries.length - 1,
          position: "top",
          formatter: ({ dataIndex }) => {
            const total = tco2Totals[dataIndex];
            if (total === 0) {
              return "";
            }
            return convertToTons(total).toLocaleString();
          },
          fontSize: defaultFontSize,
        },
        barMaxWidth: 150,
        tooltip: {
          formatter: (params: any) => {
            const { data, seriesName, color } = params;
            const castedData = data as {
              entry: ActivityEntryExtended | undefined;
              value: number;
            };
            const entry = castedData.entry;
            const tooltipInfo = [
              `<span style="display: inline-block; border-radius: 50%; margin-right: 6px; width: 10px; height: 10px; background-color: ${color}"></span>${seriesName}`,
              ...getEntryTooltip(entry),
              `<b>${castedData.value?.toLocaleString()} ${t(
                "footprint.emission.tco2.tco2e"
              )}</b>`,
            ];
            return tooltipInfo.join("<br/>");
          },
        },
      };
    }
  );

  const options: EChartsOption = {
    series,
    xAxis: {
      data: years,
    },
    title: {
      text: `${upperFirst(t("dashboard.annualGlobalAnalysis"))} > ${siteName}`,
    },
  };
  return (
    <ReactEChart
      option={merge(baseOptions, options)}
      replaceMerge="series"
      onEvents={[
        {
          eventName: "legendselectchanged",
          handler: ({ selected }: { selected: Record<string, boolean> }) => {
            setDisplayedHistory(selected);
          },
        },
      ]}
    />
  );
};

export default HistorySiteChart;
