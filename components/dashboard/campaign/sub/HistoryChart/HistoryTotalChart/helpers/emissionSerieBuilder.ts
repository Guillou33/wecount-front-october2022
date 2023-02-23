import { Scope } from "@custom-types/wecount-api/activity";
import { EntryInfo } from "@lib/core/activityEntries/entryInfo";
import { BarSeriesOption } from "echarts";

import { CampaignType } from "@custom-types/core/CampaignType";
import { defaultFontSize } from "@components/helpers/echarts/baseOptions";
import { convertToTons } from "@lib/utils/calculator";
import getScopeName from "@lib/utils/getScopeName";
import { formatNumberWithLanguage } from "@lib/translation/config/numbers";
import { t } from "i18next";

type BuilderParameters = {
  years: number[];
  campaignIdsByDate: Record<number, number>;
  campaignsInfoByScope: Record<number, Record<Scope, EntryInfo>>;
  tco2Totals: number[];
  colorOfScopesForEmission: Record<Scope, string>;
  colorOfScopesForSimulation: Record<Scope, string>;
  campaignTypes: Record<number, CampaignType>;
};
function emissionSerieBuilder({
  years,
  campaignIdsByDate,
  campaignsInfoByScope,
  tco2Totals,
  colorOfScopesForEmission,
  colorOfScopesForSimulation,
  campaignTypes,
}: BuilderParameters) {
  return (scope: Scope, index: number, scopes: Scope[]): BarSeriesOption => {
    return {
      name: getScopeName(scope),
      type: "bar",
      stack: "scope-total",
      data: years.map(year => {
        const campaignId = campaignIdsByDate[year];
        const campaignResult = campaignsInfoByScope[campaignId];
        const rawResult = campaignResult?.[scope]?.tCo2 ?? 0;
        const isSimulation =
          campaignTypes[campaignId] === CampaignType.SIMULATION;
        return {
          value: convertToTons(rawResult),
          itemStyle: {
            color: isSimulation
              ? colorOfScopesForSimulation[scope]
              : colorOfScopesForEmission[scope],
            decal: {
              symbol: isSimulation ? "rect" : "none",
              dashArrayX: [1, 0],
              dashArrayY: [3, 4],
              rotation: -Math.PI / 4,
              color: "rgba(255, 255, 255, 0.25)",
            },
          },
        };
      }),
      label: {
        show: index === scopes.length - 1,
        position: "top",
        formatter: ({ dataIndex }) => {
          const total = tco2Totals[dataIndex];
          if (total === 0) {
            return "";
          }
          return formatNumberWithLanguage(convertToTons(total));
        },
        fontSize: defaultFontSize,
      },
      tooltip: {
        valueFormatter: data =>
          `${data.toLocaleString()} ${t("footprint.emission.tco2.tco2e")}`,
      },
    };
  };
}

export { emissionSerieBuilder };
