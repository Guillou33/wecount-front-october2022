import { Context } from "chartjs-plugin-datalabels";
import { DataChunk, hoverPointerCursor } from "./mainDashboardConfig";
import { convertToTons } from "@lib/utils/calculator";
import { upperFirst } from "lodash";
import { t } from "i18next";
import { formatNumberWithLanguage } from "@lib/translation/config/numbers";
import { reformatConvertToTons } from "@lib/core/campaign/getEmissionNumbers";

export interface ActionPlanDataChunk
  extends Omit<DataChunk, "custumTooltipMetadata"> {
  custumTooltipMetadata: {
    rawValue: number;
    percentTotal: string;
  };
  customLabelMetadata: {
    tCo2: number;
    displayLabel: boolean;
  };
  datalabels?: {
    color: string;
  };
}

export const actionPlanDashboardOptions = {
  layout: {
    padding: { top: 40 },
  },
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
        return reformatConvertToTons(totalTco2) + " t";
      },
      textAlign: "center",
      font: {
        lineHeight: 1.5,
      },
    },
  },
  hover: {
    mode: "nearest",
  },
  elements: {
    rectangle: {
      borderWidth: { top: 1, left: 0, right: 0, bottom: 0 },
      borderColor: "rgba(0,0,0,0.8)",
    },
  },
};

export const actionPlanDashboardInteractiveOptions = {
  ...actionPlanDashboardOptions,
  ...hoverPointerCursor,
};
