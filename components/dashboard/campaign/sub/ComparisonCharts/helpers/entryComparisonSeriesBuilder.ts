import { BarSeriesOption } from "echarts";
import { t } from "i18next";

import { EntriesHistory } from "@lib/core/campaignHistory/getHistoryFromEntries";

import { wecountFormat } from "@lib/core/campaign/getEmissionNumbers";

type Params = {
  comparisonHistory: EntriesHistory[];
  efNames: {
    referenceId: string;
    efCampaign1: string;
    efCampaign2: string;
  }[];
  campaign1Id: number;
};

function entryComparisonSeriesBuilder({
  comparisonHistory,
  efNames,
  campaign1Id,
}: Params) {
  return (campaignId: number): BarSeriesOption => {
    const isCurrentCampaign = campaignId === campaign1Id;
    const serieColor = isCurrentCampaign ? "#1b2668" : "#dc8030";
    return {
      type: "bar",
      itemStyle: {
        color: serieColor,
      },
      data: comparisonHistory.map(history => {
        return (
          (history.entriesBycampaignId[campaignId]?.resultTco2 ?? 0) / 1000
        );
      }),
      barMaxWidth: 35,
      tooltip: {
        formatter: ({ dataIndex, color, value }: any) => {
          const efName = isCurrentCampaign
            ? efNames[dataIndex].efCampaign1
            : efNames[dataIndex].efCampaign2;

          return `<span style="display: inline-block; border-radius: 50%; margin-right: 6px; width: 10px; height: 10px; background-color: ${color}"></span>
          ${efNames[dataIndex].referenceId} : ${efName}
        <div style="text-align:right"><b>${wecountFormat(Number(value))} ${t(
            "footprint.emission.tco2.tco2e"
          )}</b></div>`;
        },
      },
      label: {
        show: true,
        formatter: ({ value }) => wecountFormat(Number(value)),
        position: "outside",
        color: serieColor,
        fontWeight: "bold",
      },
    };
  };
}

export default entryComparisonSeriesBuilder;
