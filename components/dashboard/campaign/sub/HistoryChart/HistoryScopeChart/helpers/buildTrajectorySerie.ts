import { SeriesOption } from "echarts";

import { roundValue } from "@lib/utils/calculator";
import { configureTrajectoryLine } from "../../HistoryTotalChart/helpers/buildTrajectorySerie";
import { t } from "i18next";

type BuilderParameters = {
  years: number[];
  campaignOfReferenceTotal: number;
  scopeTarget: number;
};

export function buildTrajectorySerie({
  years,
  campaignOfReferenceTotal,
  scopeTarget,
}: BuilderParameters): SeriesOption {
  const trajectoryLine = configureTrajectoryLine(
    years[0],
    campaignOfReferenceTotal,
    scopeTarget
  );
  return {
    name: "Trajectoire",
    type: "line",
    data: years.map(year => trajectoryLine(year) / 1000),
    tooltip: {
      valueFormatter: data => `${roundValue(Number(data))} ${t("footprint.emission.tco2.tco2e")}`,
    },
    connectNulls: true,
    color: "#811f3e",
  };
}
