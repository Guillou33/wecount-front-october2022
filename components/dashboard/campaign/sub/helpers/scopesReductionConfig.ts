import { merge } from "lodash/fp";
import { Context } from "chartjs-plugin-datalabels";
import {
  mainDashboardOptions,
  DataChunk as BaseDataChunk,
} from "@components/dashboard/campaign/sub/helpers/mainDashboardConfig";
import { formatNumberWithLanguage } from "@lib/translation/config/numbers";

export interface DataChunk
  extends Omit<BaseDataChunk, "custumTooltipMetadata"> {
  minBarLength?: number;
  datalabels?: {};
  labelValue?: number;
}

export const scopesReductionOptions = merge(mainDashboardOptions, {
  layout: {
    padding: {
      top: 25,
    },
  },
  tooltips: {
    enabled: false,
  },
  plugins: {
    datalabels: {
      anchor: "end",
      align: "top",
      display: (ctx: Context) => {
        const currentData = ctx.dataset.data[ctx.dataIndex];
        return currentData != null;
      },
      formatter: (label: number, ctx: Context) => {
        if (ctx.dataset.labelValue != null) {
          return `${formatNumberWithLanguage(ctx.dataset.labelValue)}`;
        }
        return formatNumberWithLanguage(label);
      },
    },
  },
});
