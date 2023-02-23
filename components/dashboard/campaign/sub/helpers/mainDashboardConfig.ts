import { formatNumberWithLanguage } from "@lib/translation/config/numbers";
import { t } from "i18next";
import { upperFirst } from "lodash";

export interface DataChunk {
  label: string;
  backgroundColor: string | string[];
  data: number[];
  custumTooltipMetadata: {
    rawValue: number;
    percentTotal: number;
  };
}

export const hoverPointerCursor = {
  onHover: (event: any, chartElement: any) => {
    event.target.style.cursor = chartElement[0] ? "pointer" : "default";
  },
};

export const mainDashboardOptions = {
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
      display: false,
    },
  },
};

export const mainDashboardInteractiveOptions = {
  ...mainDashboardOptions,
  ...hoverPointerCursor,
};
