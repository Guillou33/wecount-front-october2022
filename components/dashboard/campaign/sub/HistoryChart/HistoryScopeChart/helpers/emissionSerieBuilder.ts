import { EntryInfo } from "@lib/core/activityEntries/entryInfo";
import { ActivityCategory } from "@reducers/core/categoryReducer";
import { BarSeriesOption } from "echarts";
import { CampaignType } from "@custom-types/core/CampaignType";

import { defaultFontSize } from "@components/helpers/echarts/baseOptions";

import { convertToTons } from "@lib/utils/calculator";
import { t } from "i18next";

export type BuilderPrams = {
  years: number[];
  campaignIdsByDate: Record<number, number>;
  campaignsInfoByCategory: Record<number, Record<number, EntryInfo>>;
  colorOfCategoriesForEmission: Record<number, string>;
  colorOfCategoriesForSimulation: Record<number, string>;
  tco2Totals: number[];
  campaignTypes: Record<number, CampaignType>;
};

export function emissionSerieBuilder({
  years,
  campaignIdsByDate,
  campaignsInfoByCategory,
  colorOfCategoriesForEmission,
  colorOfCategoriesForSimulation,
  tco2Totals,
  campaignTypes,
}: BuilderPrams) {
  return (
    category: ActivityCategory,
    index: number,
    categories: ActivityCategory[]
  ): BarSeriesOption => {
    return {
      name: category?.name,
      type: "bar",
      stack: "category-total",
      data: years.map(year => {
        const campaignId = campaignIdsByDate[year];
        const campaignResult = campaignsInfoByCategory[campaignId];
        const rawResult = campaignResult?.[category.id]?.tCo2 ?? 0;
        const isSimulation =
          campaignTypes[campaignId] === CampaignType.SIMULATION;
        return {
          value: convertToTons(rawResult),
          itemStyle: {
            color: isSimulation
              ? colorOfCategoriesForSimulation[category.id]
              : colorOfCategoriesForEmission[category.id],
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
        show: index === categories.length - 1,
        position: "top",
        formatter: ({ dataIndex }) => {
          const total = tco2Totals[dataIndex];
          if (total === 0) {
            return "";
          }
          return convertToTons(total).toLocaleString();
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
