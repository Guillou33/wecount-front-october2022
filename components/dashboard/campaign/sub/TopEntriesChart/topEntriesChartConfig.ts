import { formatNumberWithLanguage } from "@lib/translation/config/numbers";
import { Context } from "chartjs-plugin-datalabels";
import { t } from "i18next";
import { upperFirst } from "lodash";
import { emissionFactorChartOptions } from "../EmissionFactorChart/emissionFactorChartOptions";

const topEntriesChartConfig = {
  ...emissionFactorChartOptions,
  scales: {
    xAxes: [
      {
        stacked: true,
        scaleLabel: {
          display: true,
          labelString: upperFirst(t("footprint.emission.tco2Emission")),
        },
      },
    ],
    yAxes: [
      {
        ticks: {
          display: true,
        },
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
  plugins: {
    datalabels: {
      anchor: "end",
      align: "end",
      color: "blue",
      formatter: (value: number, ctx: Context) => {
        if (value === null) {
          return "";
        }
        return formatNumberWithLanguage(value) + " t";
      },
    },
  },
  tooltips: {
    mode: "nearest",
    callbacks: {
      title: (tooltipItem: any, data: any) => {
        const title = data.datasets[tooltipItem[0].datasetIndex].tooltipTitles[
          tooltipItem[0].index
        ].filter((data: any) => data !== null);
        return title;
      },
      afterLabel: (tooltipItem: any, data: any) => {
        const currentData = data.datasets[tooltipItem.datasetIndex];
        return [
          "",
          `${formatNumberWithLanguage(currentData.data[tooltipItem.index])} tCO2`,
          "",
          `${formatNumberWithLanguage(currentData.percentagesOfTotal[tooltipItem.index])} %`,
          "",
        ];
      },
      label: () => {
        return "";
      },
    },
  },
};

export { topEntriesChartConfig };
