import { useSelector } from "react-redux";
import { CampaignTrajectory } from "@reducers/trajectory/campaignTrajectories/campaignTrajectoriesReducer";
import { RootState } from "@reducers/index";
import useCategoryInfo from "@hooks/core/useCategoryInfo";
import { getMemoizedReductionTco2ByCategory } from "@hooks/core/helpers/getReductionInfoByCategory";
import useNotExcludedEntriesInfoByCategory from "./notExcludedActivityEntryInfo/useNotExcludedEntriesByCategory";
import useNotExcludedEntriesInfoByScope from "./notExcludedActivityEntryInfo/useNotExcludedEntriesInfoByScope";

function useReductionInfoByCategory(trajectoryId: number) {
  const trajectory = useSelector<RootState, CampaignTrajectory>(
    state => state.trajectory.campaignTrajectories[trajectoryId]
  );
  const entryInfoByCategory = useNotExcludedEntriesInfoByCategory(
    trajectory.campaignId
  );

  const entryInfoByScope = useNotExcludedEntriesInfoByScope(trajectory.campaignId);

  const categoryInfo = useCategoryInfo();

  return getMemoizedReductionTco2ByCategory(
    entryInfoByCategory,
    trajectory.categoriesActionPlan,
    categoryInfo,
    entryInfoByScope
  );
}

export default useReductionInfoByCategory;
