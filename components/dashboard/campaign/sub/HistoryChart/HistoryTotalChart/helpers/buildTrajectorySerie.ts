import { SeriesOption } from "echarts";
import { Scope } from "@custom-types/wecount-api/activity";
import { EntryInfo } from "@lib/core/activityEntries/entryInfo";
import { ScopeTargets } from "@reducers/trajectory/campaignTrajectories/campaignTrajectoriesReducer";

import { getTrajectoryOptionsforScope } from "@components/campaign/detail/trajectory/utils/trajectoryOptionsForScopes";
import { getXPercentOf } from "@lib/utils/calculator";
import { roundValue } from "@lib/utils/calculator";
import { t } from "i18next";
import { upperFirst } from "lodash";

export function configureTrajectoryLine(
  startYear: number,
  startTco2Total: number,
  target: number
) {
  return (year: number) => {
    const yearIndex = year - startYear;
    return startTco2Total - getXPercentOf(yearIndex * target, startTco2Total);
  };
}

type BuilderParameters = {
  years: number[];
  scopes: Scope[];
  campaignOfReferenceTotalByScope: Record<Scope, EntryInfo>;
  scopeTargets: ScopeTargets;
};

function buildTrajectorySerie({
  years,
  scopes,
  scopeTargets,
  campaignOfReferenceTotalByScope,
}: BuilderParameters): SeriesOption {
  const scopeTargetLines = scopes.map(scope =>
    configureTrajectoryLine(
      years[0],
      campaignOfReferenceTotalByScope[scope].tCo2,
      scopeTargets[scope]?.target ??
        getTrajectoryOptionsforScope(scope)[0].value
    )
  );
  return {
    name: upperFirst(t("trajectory.trajectory")),
    type: "line",
    data: years.map(year => {
      return (
        scopeTargetLines.reduce((result, targetLine) => {
          return result + targetLine(year);
        }, 0) / 1000
      );
    }),
    tooltip: {
      valueFormatter: data => `${roundValue(Number(data))} ${t("footprint.emission.tco2.tco2e")}`,
    },
    color: "#811f3e",
  };
}

export { buildTrajectorySerie };
