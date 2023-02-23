import { useSelector } from "react-redux";
import { CampaignTrajectory } from "@reducers/trajectory/campaignTrajectories/campaignTrajectoriesReducer";
import { RootState } from "@reducers/index";
import useActivityModelInfo from "./useActivityModelInfo";
import { getMemoizedReductionTco2ByActivityModel } from "./helpers/getReductionInfoByActivityModel";
import _ from "lodash";
import useTrajectoryDashboardEntriesByScope from "./trajectoryDashboardEntryInfo/useTrajectoryDashboardEntriesByScope";
import useTrajectoryDashboardEntriesByActivityModel from "./trajectoryDashboardEntryInfo/useTrajectoryDashboardEntriesByActivityModel";

function useReductionInfoByActivityModelForTrajectoryDashboard(trajectoryId: number) {
    const trajectory = useSelector<RootState, CampaignTrajectory>(
        state => state.trajectory.campaignTrajectories[trajectoryId]
    );

    const entryInfoByActivityModel = useTrajectoryDashboardEntriesByActivityModel(
        trajectory.campaignId
    );
    const entryInfoByScope = useTrajectoryDashboardEntriesByScope(trajectory.campaignId);

    const activityModelInfo = useActivityModelInfo();

    return getMemoizedReductionTco2ByActivityModel(
        entryInfoByActivityModel,
        trajectory.activityModelsActionPlan,
        activityModelInfo,
        entryInfoByScope
    );
}

export default useReductionInfoByActivityModelForTrajectoryDashboard;
