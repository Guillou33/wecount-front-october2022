import { Context } from "chartjs-plugin-datalabels";
import { DataChunk, hoverPointerCursor } from "./mainDashboardConfig";
import {
  convertToTons,
} from "@lib/utils/calculator";
import { upperFirst } from "lodash";
import { t } from "i18next";
import { formatNumberWithLanguage } from "@lib/translation/config/numbers";
import { reformatConvertToTons } from "@lib/core/campaign/getEmissionNumbers";

const topResultDashboardOptions = {
  maintainAspectRatio: false,
  layout: {
    padding: {
      right: 100,
    },
  },
  legend: {
    display: false,
  },
  scales: {
    xAxes: [
      {
        stacked: true,
        scaleLabel: {
          display: true,
          labelString: upperFirst(t("footprint.emission.tco2.tco2")),
        },
      },
    ],
    yAxes: [
      {
        scaleLabel: {
          display: false,
        },
        gridLines: {
          display: false,
        },
        stacked: true,
      },
    ],
  },
  tooltips: {
    mode: "nearest",
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
  hover: {
    mode: "nearest",
  },
  elements: {
    rectangle: {
      borderWidth: { top: 0, left: 0, right: 1, bottom: 0 },
      borderColor: "rgba(0,0,0,0.8)",
    },
  },
  plugins: {
    datalabels: {
      anchor: "end",
      align: "end",
      display: (ctx: Context) => {
        return (
          ctx.dataset.customLabelMetadata.displayLabel &&
          ctx.dataset.data[ctx.dataIndex] > 0
        );
      },
      formatter: (_: string, ctx: Context) => {
        const totalTco2 = ctx.dataset.customLabelMetadata.tCo2;
        return reformatConvertToTons(totalTco2) + " t";
      },
    },
  },
};

export const topEmissionsDashboardOptions = {
  ...topResultDashboardOptions,
};

export const topEmissionsDashboardInteractiveOptions = {
  ...topEmissionsDashboardOptions,
  ...hoverPointerCursor,
};
