import { Scope } from "@custom-types/wecount-api/activity";
import { EntryInfo } from "@lib/core/activityEntries/entryInfo";
import { SeriesOption } from "echarts";
import { ReductionInfoByScope } from "@hooks/core/useReductionInfoTotalForTrajectoryDashboard";

import { defaultFontSize } from "@components/helpers/echarts/baseOptions";
import { convertToTons } from "@lib/utils/calculator";
import getScopeName from "@lib/utils/getScopeName";
import { t } from "i18next";
import { upperFirst } from "lodash";

type BuilderParameters = {
  years: number[];
  targetYear: number;
  campaignOfReferenceTotalByScope: Record<Scope, EntryInfo>;
  reductionInfoByScope: ReductionInfoByScope;
  tco2Totals: number[];
  colorOfScopes: Record<Scope, string>;
};

function projectionSerieBuilder({
  years,
  targetYear,
  reductionInfoByScope,
  tco2Totals,
  campaignOfReferenceTotalByScope,
  colorOfScopes,
}: BuilderParameters) {
  const projectionIndex = years.findIndex(year => year === targetYear);
  return (scope: Scope, index: number, scopes: Scope[]): SeriesOption => ({
    name: getScopeName(scope),
    type: "bar",
    stack: "scope-total",
    data: years.map(year => {
      if (year === targetYear && reductionInfoByScope != null) {
        return convertToTons(
          campaignOfReferenceTotalByScope[scope].tCo2 +
            reductionInfoByScope[scope].reductionTco2
        );
      }
      return 0;
    }),
    label: {
      show: index === scopes.length - 1,
      position: "top",
      formatter: ({ dataIndex }) => {
        const total = convertToTons(
          tco2Totals[0] +
            scopes.reduce((reduction, scope) => {
              return reduction + reductionInfoByScope[scope].reductionTco2;
            }, 0)
        );
        if (total === 0 || dataIndex !== projectionIndex) {
          return "";
        }
        return total.toLocaleString();
      },
      fontSize: defaultFontSize,
    },
    tooltip: {
      valueFormatter: data =>
        `${upperFirst(t("trajectory.projection.projection"))} ${getScopeName(scope)} - ${data} ${t("footprint.emission.tco2.tco2e")}`,
    },
    color: colorOfScopes[scope],
  });
}

export { projectionSerieBuilder };
