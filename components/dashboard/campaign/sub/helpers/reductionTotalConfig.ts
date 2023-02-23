import { merge, upperFirst } from "lodash/fp";
import { Context } from "chartjs-plugin-datalabels";

import {
    DataChunk as BaseDataChunk,
    mainDashboardOptions,
} from "@components/dashboard/campaign/sub/helpers/mainDashboardConfig";
import { Scope } from "@custom-types/wecount-api/activity";
import { t } from "i18next";
import { formatNumberWithLanguage } from "@lib/translation/config/numbers";

export const scopeConfigReference = {
    [Scope.UPSTREAM]: { label: upperFirst(t("footprint.scope.upstream")), color: "#1D2FA1" },
    [Scope.CORE]: { label: upperFirst(t("footprint.scope.core")), color: "#5065C0" },
    [Scope.DOWNSTREAM]: { label: upperFirst(t("footprint.scope.downstream")), color: "#6A80D0" },
};

export const scopeConfigTarget = {
    [Scope.UPSTREAM]: { label: upperFirst(t("footprint.scope.upstream")), color: "#839BE0" },
    [Scope.CORE]: { label: upperFirst(t("footprint.scope.core")), color: "#9DB6EF" },
    [Scope.DOWNSTREAM]: { label: upperFirst(t("footprint.scope.downstream")), color: "#B6D1FF" },
};

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
    custumTooltipMetadata: {
        rawValue: number[];
        percentTotal: number[];
    };
    tco2Totals: number[];
}

export const reductionTotalConfig = merge(mainDashboardOptions, {
    spanGaps: true,
    tooltips: {
        callbacks: {
            afterLabel: (tooltipItem: any, data: any) => {
                const currentData: BarDataChunk = data.datasets[tooltipItem.datasetIndex];
                return currentData.custumTooltipMetadata && currentData.custumTooltipMetadata !== undefined ? [
                    `${formatNumberWithLanguage(currentData.custumTooltipMetadata.rawValue[tooltipItem.index])
                    } tCO2`,
                    `${formatNumberWithLanguage(currentData.custumTooltipMetadata.percentTotal[tooltipItem.index])
                    } %`,
                ] : [];
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
                return ctx.dataset.type === "line";
            },
            formatter: (value: number, ctx: Context) => {
                return `${formatNumberWithLanguage(value)} ${t("footprint.emission.tco2.tco2e")}`;
            },
        },
    },
});
