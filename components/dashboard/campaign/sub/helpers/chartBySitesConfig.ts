import { merge } from "lodash/fp";
import { Context } from "chartjs-plugin-datalabels";

import {
  DataChunk as BaseDataChunk,
  mainDashboardOptions,
} from "@components/dashboard/campaign/sub/helpers/mainDashboardConfig";
import { formatNumberWithLanguage } from "@lib/translation/config/numbers";
import { t } from "i18next";

export interface DataChunk
  extends Omit<BaseDataChunk, "custumTooltipMetadata"> {
  custumTooltipMetadata: {
    rawValue: number[];
    percentTotal: number[];
  };
  tco2Totals: number[];
}

export const chartBySitesOptions = merge(mainDashboardOptions, {
  tooltips: {
    callbacks: {
      afterLabel: (tooltipItem: any, data: any) => {
        const currentData: DataChunk = data.datasets[tooltipItem.datasetIndex];
        return [
          `${
            formatNumberWithLanguage(currentData.custumTooltipMetadata.rawValue[tooltipItem.index])
          } tCO2`,
          `${
            formatNumberWithLanguage(currentData.custumTooltipMetadata.percentTotal[tooltipItem.index])
          } %`,
        ];
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
  plugins: {
    datalabels: {
      anchor: "end",
      align: "top",
      display: (ctx: Context) => {
        return ctx.datasetIndex === 2 && ctx.dataset.tco2Totals[ctx.dataIndex] > 0;
      },
      formatter: (_: string, ctx: Context) => {
        const totalTco2 = ctx.dataset.tco2Totals[ctx.dataIndex];
        return `${formatNumberWithLanguage(totalTco2)} ${t("footprint.emission.tco2.tco2e")}`;
      },
    },
  },
});
