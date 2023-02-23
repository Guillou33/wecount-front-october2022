import { merge } from "lodash/fp";
import { Context } from "chartjs-plugin-datalabels";

import {
  mainDashboardOptions,
  DataChunk as BaseDataChunk,
} from "@components/dashboard/campaign/sub/helpers/mainDashboardConfig";
import { formatNumberWithLanguage } from "@lib/translation/config/numbers";
import { t } from "i18next";

export type DataChunk = LineDataChunk | BarDataChunk;

export interface LineDataChunk
  extends Omit<BaseDataChunk, "custumTooltipMetadata" | "backgroundColor"> {
  type: "line";
  borderColor: string;
  borderWidth: number;
  fill: boolean;
}

export interface BarDataChunk
  extends Omit<BaseDataChunk, "custumTooltipMetadata"> {
  type: "bar";
  metadata: {
    tco2: number;
  };
}

export function isLineDataChunk(
  dataChunk: DataChunk
): dataChunk is LineDataChunk {
  return dataChunk.type === "line";
}

export function isBarDataChunk(
  dataChunk: DataChunk
): dataChunk is BarDataChunk {
  return dataChunk.type === "bar";
}

export const trajectoryOverviewOptions = merge(mainDashboardOptions, {
  layout: {
    padding: {
      top: 25,
    },
  },
  legend: {
    display: true,
    position: "bottom",
  },
  spanGaps: true,
  tooltips: {
    filter: (tooltipItem: any, data: any) => {
      return data.datasets[tooltipItem.datasetIndex].type !== "line";
    },
    callbacks: {
      title: (tooltipItem: any, data: any) => {
        if (tooltipItem.length === 0) {
          return;
        }
        const currentData: DataChunk =
          data.datasets[tooltipItem[0].datasetIndex];
        return currentData.label;
      },
      afterLabel: (tooltipItem: any, data: any) => {
        const currentData: DataChunk = data.datasets[tooltipItem.datasetIndex];
        if (isBarDataChunk(currentData)) {
          return ["", `${formatNumberWithLanguage(currentData.metadata.tco2)} tCO2`];
        }
        return "";
      },
    },
  },
  hover: {
    mode: "nearest",
  },
  plugins: {
    datalabels: {
      anchor: "end",
      align: "top",
      display: (ctx: Context) => {
        return ctx.dataset.type === "line";
      },
      formatter: (value: number, ctx: Context) => {
        return `${formatNumberWithLanguage(value)} ${t("footprint.emission.tco2.tco2e")}`;
      },
    },
  },
});
