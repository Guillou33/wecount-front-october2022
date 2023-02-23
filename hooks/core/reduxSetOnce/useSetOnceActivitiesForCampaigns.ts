import { getActivitiesForCampaigns } from "@actions/campaign/campaignActions";
import { Campaign } from "@reducers/campaignReducer";
import { RootState } from "@reducers/index";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

type CampaignList = {
  [key: number]: Campaign;
};

function useSetOnceActivitiesForAllCampaigns() {
  const dispatch = useDispatch();
  const campaignList = useSelector<RootState, CampaignList>(
    state => state.campaign.campaigns
  );

  const campaignsIdsToFetch = Object.entries(campaignList)
    .filter(([_, campaign]: [string, Campaign]) => !campaign.activitiesFetched)
    .map(([campaignId, _]) => Number(campaignId));

  useEffect(() => {
    if (campaignsIdsToFetch.length > 0) {
      dispatch(getActivitiesForCampaigns(campaignsIdsToFetch));
    }
  }, []);
}

export default useSetOnceActivitiesForAllCampaigns;
