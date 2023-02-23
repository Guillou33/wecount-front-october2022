import { Bar } from "react-chartjs-2";
import {
  trajectoryOverviewOptions,
  DataChunk,
} from "@components/dashboard/campaign/sub/helpers/trajactoryOverviewConfig";
import { Scope } from "@custom-types/wecount-api/activity";
import { uniqueId, upperFirst } from "lodash";
import { getXPercentOf, convertToTons } from "@lib/utils/calculator";
import { ReductionInfo } from "@hooks/core/helpers/getReductionInfoByCategory";
import { scopeLabels } from "@components/campaign/detail/trajectory/utils/scopeLabels";
import { trajectoryOptions } from "@components/campaign/detail/trajectory/helpers/trajectoryOptions";
import { t } from "i18next";

interface Props {
  selectedScope: Scope;
  year: number;
  targetYear: number;
  scopeTco2: number;
  scopeTarget: number;
  reductionInfo: ReductionInfo;
}

const TrajectoryOverview = ({
  selectedScope,
  year,
  targetYear,
  scopeTarget,
  scopeTco2,
  reductionInfo,
}: Props) => {
  let labels = [];
  for (let i = year!; i <= targetYear!; i++) {
    labels.push(i);
  }

  const target = getTargetTco2(
    year,
    targetYear,
    scopeTarget,
    scopeTco2
  );

  const lineData = new Array(labels.length);
  lineData[0] = convertToTons(scopeTco2);
  lineData[lineData.length - 1] = target ? convertToTons(target) : null;

  const barData1 = new Array(labels.length);
  barData1[0] = convertToTons(scopeTco2);

  const barData2 = new Array(labels.length);
  // barData2[barData2.length - 1] = convertToTons(
  //   scopeTco2 - Math.abs(reductionInfo.reductionTco2)
  // );
  barData2[barData2.length - 1] = convertToTons(
    scopeTco2 + reductionInfo.reductionTco2
  );

  const scopeTargetLabel =
    trajectoryOptions.find(target => target.value === scopeTarget)?.label ??
    `-${scopeTarget}% ${t("global.other.per")} ${t("global.time.y")}`;

  const datasets: DataChunk[] = [
    {
      type: "line",
      label: `${upperFirst(t("trajectory.trajectory"))} ${scopeTargetLabel}`,
      borderColor: "#b395e0",
      borderWidth: 2,
      fill: false,
      data: lineData,
    },
    {
      type: "bar",
      label: `${upperFirst(t("footprint.emission.mesuredGhg"))} ${scopeLabels[selectedScope]}`,
      backgroundColor: "#5065C0",
      data: barData1,
      metadata: {
        tco2: barData1[0],
      },
    },
    {
      type: "bar",
      label: `${upperFirst(t("trajectory.projection.actionPlan.estimation"))} ${scopeLabels[selectedScope]}`,
      backgroundColor: "#B6D1FF",
      data: barData2,
      metadata: {
        tco2: barData2[barData2.length - 1],
      },
    },
  ];

  return (
    <Bar
      data={{
        labels,
        datasets,
      }}
      options={trajectoryOverviewOptions}
      datasetKeyProvider={uniqueId}
    />
  );
};

export default TrajectoryOverview;

function getTargetTco2(
  year: number,
  targetYear: number,
  yearlyReduction: number,
  campaignTco2: number
): number {
  const yearRange = targetYear - year;
  const target = yearRange * yearlyReduction;

  return campaignTco2 - getXPercentOf(target, campaignTco2);
}
