import { useSelector } from "react-redux";
import { CampaignTrajectory } from "@reducers/trajectory/campaignTrajectories/campaignTrajectoriesReducer";
import { RootState } from "@reducers/index";
import useActivityModelInfo from "./useActivityModelInfo";
import { getMemoizedReductionTco2ByActivityModel } from "./helpers/getReductionInfoByActivityModel";
import _ from "lodash";
import useNotExcludedEntriesInfoByActivityModel from "./notExcludedActivityEntryInfo/useNotExcludedEntriesByActivityModel";
import useNotExcludedEntriesInfoByScope from "./notExcludedActivityEntryInfo/useNotExcludedEntriesInfoByScope";

function useReductionInfoByActivityModel(trajectoryId: number) {
    const trajectory = useSelector<RootState, CampaignTrajectory>(
        state => state.trajectory.campaignTrajectories[trajectoryId]
    );

    const entryInfoByActivityModel = useNotExcludedEntriesInfoByActivityModel(
        trajectory.campaignId
    );
    const entryInfoByScope = useNotExcludedEntriesInfoByScope(trajectory.campaignId);

    const activityModelInfo = useActivityModelInfo();

    return getMemoizedReductionTco2ByActivityModel(
        entryInfoByActivityModel,
        trajectory.activityModelsActionPlan,
        activityModelInfo,
        entryInfoByScope
    );
}

export default useReductionInfoByActivityModel;
