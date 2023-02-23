import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from "@reducers/index";
import { CampaignInformation } from "@reducers/campaignReducer";
import { requestCreateTrajectory } from "@actions/trajectory/campaigntrajectories/campaignTrajectoriesAction";

function useCreateTrajectoryIfNeeded(campaignId: number | undefined) {
  const dispatch = useDispatch();

  const campaignInfo = useSelector<RootState, CampaignInformation | undefined>(
    state =>
      campaignId ? state.campaign.campaigns[campaignId]?.information : undefined
  );

  useEffect(() => {
    const campaignTrajectories = campaignInfo?.campaignTrajectoryIds;

    const mustCreateTrajectory =
      campaignTrajectories != null && campaignTrajectories.length === 0;

    if (mustCreateTrajectory && campaignId != null) {
      dispatch(requestCreateTrajectory(campaignId));
    }
  }, [campaignInfo]);
}

export default useCreateTrajectoryIfNeeded;
