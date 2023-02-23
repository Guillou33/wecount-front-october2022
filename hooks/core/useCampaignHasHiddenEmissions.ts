import useSetOnceActivityModelVisibilities from "@hooks/core/reduxSetOnce/useSetOnceActivityModelVisibilities";
import useVisibleActivityModelIds from "@hooks/core/useVisibleActivityModelIds";
import useActivityInfoByActivityModel from "@hooks/core/useActivityInfoByActivityModel";
import { ActivityInfo } from "@hooks/core/helpers/activityInfo";

function useCampaignHasHiddenEmissions(campaignId: number): boolean {
  useSetOnceActivityModelVisibilities();
  const visibleActivityModelIds = useVisibleActivityModelIds();

  const activityInfoByActivityModel =
    useActivityInfoByActivityModel(campaignId);

  if (visibleActivityModelIds == null) {
    return false;
  }

  return Object.entries(activityInfoByActivityModel).some(
    ([id, activityInfo]: [string, ActivityInfo]) => {
      const hasEmissions = activityInfo.tCo2 !== 0;
      const isActivityModelHidden = visibleActivityModelIds[Number(id)] == null;

      return hasEmissions && isActivityModelHidden;
    }
  );
}

export default useCampaignHasHiddenEmissions;
