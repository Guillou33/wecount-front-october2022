import { Context } from "chartjs-plugin-datalabels";
import { DataChunk } from "./mainDashboardConfig";
import { convertToTons } from "@lib/utils/calculator";
import { t } from "i18next";
import { upperFirst } from "lodash";
import { formatNumberWithLanguage } from "@lib/translation/config/numbers";
import { reformatConvertToTons } from "@lib/core/campaign/getEmissionNumbers";

export const comparisonDashboardOptions = {
  legend: {
    display: false,
  },
  tooltips: {
    callbacks: {
      title: (tooltipItem: any, data: any) => {
        const currentData: DataChunk =
          data.datasets[tooltipItem[0].datasetIndex];
        return currentData.label;
      },
      afterLabel: (tooltipItem: any, data: any) => {
        const currentData: DataChunk = data.datasets[tooltipItem.datasetIndex];
        return [
          "",
          `${formatNumberWithLanguage(currentData.custumTooltipMetadata.rawValue)} tCO2`,
          "",
          `${formatNumberWithLanguage(currentData.custumTooltipMetadata.percentTotal)} %`,
          "",
        ];
      },
      label: (tooltipItem: any, data: any) => {
        return "";
      },
    },
  },
  scales: {
    xAxes: [
      {
        stacked: true,
        gridLines: {
          display: false,
        },
      },
    ],
    yAxes: [
      {
        scaleLabel: {
          display: true,
          labelString: upperFirst(t("footprint.emission.tco2.equivalentTco2")),
        },

        stacked: true,
        ticks: {
          beginAtZero: true,
        },
        type: "linear",
      },
    ],
  },
  plugins: {
    datalabels: {
      anchor: "end",
      align: "top",
      display: (ctx: Context) => {
        return (
          ctx.dataset.customLabelMetadata.displayLabel &&
          ctx.dataset.data[ctx.dataIndex] > 0
        );
      },
      formatter: (_: string, ctx: Context) => {
        const totalTco2 = ctx.dataset.customLabelMetadata.tCo2;
        return `${reformatConvertToTons(totalTco2)} t`;
      },
    },
  },
  hover: {
    mode: "nearest",
  },
  layout: {
    padding: {
      top: 25,
    },
  },
  elements: {
    rectangle: {
      borderWidth: { top: 1, left: 0, right: 0, bottom: 0 },
      borderColor: "rgba(0,0,0,0.8)",
    },
  },
};
