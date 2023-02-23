import { Context } from "chartjs-plugin-datalabels";
import { topEmissionsDashboardOptions } from "@components/dashboard/campaign/sub/helpers/topResultDashboardConfig";
import { formatNumberWithLanguage } from "@lib/translation/config/numbers";

const emissionFactorChartOptions = {
  ...topEmissionsDashboardOptions,
  plugins: {
    datalabels: {
      anchor: "end",
      align: "end",
      color: "blue",
      formatter: (value: string, ctx: Context) => {
        if (value === null) {
          return "";
        }
        const dataIndex = ctx.dataIndex;
        return formatNumberWithLanguage(ctx.dataset.emissionFactorTotals[dataIndex]) + " t";
      },
    },
  },
  elements: {},
  tooltips: {
    mode: "nearest",
    callbacks: {
      title: (tooltipItem: any, data: any) => {
        const instruction =
          data.datasets[tooltipItem[0].datasetIndex].instructions[
            tooltipItem[0].index
          ];
        return instruction ?? tooltipItem[0].label;
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

export { emissionFactorChartOptions };
