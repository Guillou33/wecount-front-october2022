import { EntryInfo } from "@lib/core/activityEntries/entryInfo";
import { ActivityCategory } from "@reducers/core/categoryReducer";
import { SeriesOption } from "echarts";
import { ReductionInfo } from "@hooks/core/helpers/getReductionInfoByActivityModel";

import { defaultFontSize } from "@components/helpers/echarts/baseOptions";

import { convertToTons } from "@lib/utils/calculator";
import { t } from "i18next";

export type BuilderPrams = {
  years: number[];
  targetYear: number;
  campaignOfReferenceInfoByCategory: Record<number, EntryInfo>;
  reductionInfoByCategory: Record<number, ReductionInfo>;
  colorOfCategories: Record<number, string>;
  tco2Totals: number[];
  displayedCategoryNames: Record<string, boolean>;
};

export function projectionSerieBuilder({
  years,
  targetYear,
  campaignOfReferenceInfoByCategory,
  reductionInfoByCategory,
  colorOfCategories,
  tco2Totals,
  displayedCategoryNames,
}: BuilderPrams) {
  const projectionIndex = years.findIndex(year => year === targetYear);
  return (
    category: ActivityCategory,
    index: number,
    categories: ActivityCategory[]
  ): SeriesOption => {
    const categoryTco2OfcampaignOfReference =
      campaignOfReferenceInfoByCategory?.[category.id]?.tCo2 ?? 0;
    const rawReductionResult =
      categoryTco2OfcampaignOfReference +
      (reductionInfoByCategory?.[category.id]?.reductionTco2 ?? 0);
    return {
      name: category?.name,
      type: "bar",
      stack: "category-total",
      data: years.map(year => {
        if (year === targetYear) {
          return convertToTons(rawReductionResult);
        }
        return 0;
      }),
      tooltip: {
        valueFormatter: data => `${t("trajectory.projection.projection")} - ${data.toLocaleString()} ${t("footprint.emission.tco2.tco2e")}`,
      },
      label: {
        show: index === categories.length - 1,
        position: "top",
        formatter: ({ dataIndex }) => {
          const total = convertToTons(
            tco2Totals[0] +
              categories.reduce((reduction, category) => {
                if (!displayedCategoryNames[category.name]) {
                  return reduction;
                }
                const categoryReduction =
                  reductionInfoByCategory?.[category.id]?.reductionTco2 ?? 0;
                return reduction + categoryReduction;
              }, 0)
          );
          if (total === 0 || dataIndex !== projectionIndex) {
            return "";
          }
          return total.toLocaleString();
        },
        fontSize: defaultFontSize,
      },
      color: colorOfCategories[category.id],
    };
  };
}
