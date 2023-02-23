import { useSelector } from "react-redux";

import { RootState } from "@reducers/index";
import { TrajectorySettings } from "@reducers/trajectory/trajectorySettings/trajectorySettingsReducer";
import { Scope } from "@custom-types/wecount-api/activity";
import { CampaignTrajectory } from "@reducers/trajectory/campaignTrajectories/campaignTrajectoriesReducer";
import TrajectoryOverview from "./TrajectoryOverview";
import useReductionInfoByScope from "@hooks/core/useReductionInfoByScope";
import useAllEntriesInfoByScope from "@hooks/core/activityEntryInfo/useAllEntriesInfoByScope";
import ChartNotAvailableInfo from "./ChartNotAvailableInfo";
import useNotExcludedEntriesInfoByScope from "@hooks/core/notExcludedActivityEntryInfo/useNotExcludedEntriesInfoByScope";
import useReductionInfoByScopeForTrajectoryDashboard from "@hooks/core/useReductionInfoByScopeForTrajectoryDashboard";
import useTrajectoryDashboardEntriesByScope from "@hooks/core/trajectoryDashboardEntryInfo/useTrajectoryDashboardEntriesByScope";
import { getTrajectoryOptionsforScope } from "@components/campaign/detail/trajectory/utils/trajectoryOptionsForScopes";

interface Props {
  selectedScope: Scope;
  trajectory: CampaignTrajectory;
  year: number | null;
  targetYear: number | null;
}

const TrajectoryOverviewContainer = ({
  year,
  targetYear,
  trajectory,
  selectedScope,
}: Props) => {

  const trajectorySettings = useSelector<RootState, TrajectorySettings>(
    state => state.trajectory.trajectorySettings
  );
  const scopeTarget = trajectorySettings.scopeTargets[selectedScope].target ?? getTrajectoryOptionsforScope(selectedScope)[0].value;
  const reductionInfo = useReductionInfoByScopeForTrajectoryDashboard(trajectory.id)[selectedScope];
  const scopeTco2 = useTrajectoryDashboardEntriesByScope(trajectory.campaignId)[selectedScope]
    .tCo2;

  return year != null &&
    targetYear != null &&
    scopeTarget != null &&
    scopeTco2 !== 0 ? (
    <TrajectoryOverview
      scopeTco2={scopeTco2}
      year={year}
      targetYear={targetYear}
      selectedScope={selectedScope}
      reductionInfo={reductionInfo}
      scopeTarget={scopeTarget}
    />
  ) : (
    <ChartNotAvailableInfo
      year={year}
      targetYear={targetYear}
      scopeTarget={scopeTarget}
      scopeTco2={scopeTco2}
    />
  );
};

export default TrajectoryOverviewContainer;
