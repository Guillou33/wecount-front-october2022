import { useSelector } from "react-redux";
import { RootState } from "@reducers/index";
import { CampaignInformation } from "@reducers/campaignReducer";

function useFirstTrajectory(campaignId: number): number | null {
  const currentCampaignInfo = useSelector<
    RootState,
    CampaignInformation | undefined
  >(state =>
    campaignId ? state.campaign.campaigns[campaignId]?.information : undefined
  );
  const campaignTrajectories = currentCampaignInfo?.campaignTrajectoryIds ?? [];

  return campaignTrajectories[0] ?? null;
}

export default useFirstTrajectory;
