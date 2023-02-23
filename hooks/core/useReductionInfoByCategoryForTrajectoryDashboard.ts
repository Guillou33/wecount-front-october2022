import { useSelector } from "react-redux";
import { CampaignTrajectory } from "@reducers/trajectory/campaignTrajectories/campaignTrajectoriesReducer";
import { RootState } from "@reducers/index";
import useCategoryInfo from "@hooks/core/useCategoryInfo";
import { getMemoizedReductionTco2ByCategory } from "@hooks/core/helpers/getReductionInfoByCategory";
import useTrajectoryDashboardEntriesByScope from "./trajectoryDashboardEntryInfo/useTrajectoryDashboardEntriesByScope";
import useTrajectoryDashboardEntriesByCategory from "./trajectoryDashboardEntryInfo/useTrajectoryDashboardEntriesByCategory";

function useReductionInfoByCategoryForTrajectoryDashboard(trajectoryId: number) {
    const trajectory = useSelector<RootState, CampaignTrajectory>(
        state => state.trajectory.campaignTrajectories[trajectoryId]
    );
    const entryInfoByCategory = useTrajectoryDashboardEntriesByCategory(
        trajectory.campaignId
    );

    const entryInfoByScope = useTrajectoryDashboardEntriesByScope(trajectory.campaignId);

    const categoryInfo = useCategoryInfo();

    return getMemoizedReductionTco2ByCategory(
        entryInfoByCategory,
        trajectory.categoriesActionPlan,
        categoryInfo,
        entryInfoByScope
    );
}

export default useReductionInfoByCategoryForTrajectoryDashboard;
