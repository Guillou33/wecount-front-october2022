import { t } from "i18next";

import { SeriesOption, TooltipComponentFormatterCallbackParams } from "echarts";
import { getBarColor, getLabelColor } from "./chartColors";
import getAbsoluteMaximum from "./getAxisMinMax";
import { Result } from "./getCampaignResultsDiff";
import { wecountFormat } from "@lib/core/campaign/getEmissionNumbers";

function getSeries(
  results: Result[],
  tco2Total: number,
  campaignName: string | undefined
): SeriesOption[] {
  const getPercentage = (value: number) =>
    Math.abs((value / (tco2Total / 1000)) * 100);
  const absoluteMax = results.reduce(getAbsoluteMaximum, 1);

  return [
    {
      type: "bar",
      stack: "result",
      name: "to be ignored",
      data: results.map(({ value }) => {
        return {
          value: 0,
          label: {
            show: true,
            position: value >= 0 ? "left" : "right",
            formatter: "{b}",
            silent: true,
          },
        };
      }),
      tooltip: {
        show: false,
      },
    },
    {
      type: "bar",
      stack: "none",
      name: "to be ignored",
      data: [
        {
          value: -absoluteMax,
        },
        {
          value: absoluteMax,
        },
      ],
      label: {
        show: false,
      },
      silent: true,
      itemStyle: {
        color: "transparent",
      },
      barMaxWidth: 1,
    },
    {
      type: "bar",
      stack: "result",
      name: "results",
      data: results.map(({ value }) => ({
        value,
        label: {
          position: value >= 0 ? "right" : "left",
          formatter: () => wecountFormat(value),
          color: getLabelColor(value),
          fontWeight: value !== 0 ? 600 : undefined,
        },
        itemStyle: {
          color: getBarColor(value),
        },
        tooltip: {
          formatter: (param: TooltipComponentFormatterCallbackParams) => {
            if (Array.isArray(param) || typeof param.value !== "number") {
              return "";
            }
            const { name, value } = param;
            const percentage = getPercentage(value);
            return `${name} : <b>${wecountFormat(value)} ${t(
              "footprint.emission.tco2.tco2e"
            )}</b> <div style="text-align: right"><b>${wecountFormat(
              percentage
            )}%</b> ${t("dashboard.common.ofTotal")} ${
              campaignName != null
                ? `${t("dashboard.common.of")} <b>${campaignName}</b>`
                : ""
            }</div>`;
          },
        },
      })),
      label: {
        show: true,
      },

      barMaxWidth: 35,
    },
  ];
}

export default getSeries;
