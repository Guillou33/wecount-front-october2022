import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from "@reducers/index";
import { loadCampaignListingPreferences } from "@actions/userPreference/campaignListing/campaignListingActions";
import { ListingColumn } from "@custom-types/wecount-api/campaignListing";

const useSetOnceCampaignListingPreference = (
  campaignId: number
): ListingColumn[] | undefined => {
  const dispatch = useDispatch();
  const campaignListingPreference = useSelector<
    RootState,
    ListingColumn[] | undefined
  >(state => state.userPreference.campaignListing.visibleColumns[campaignId]);

  useEffect(() => {
    if (campaignListingPreference == null) {
      dispatch(loadCampaignListingPreferences(campaignId));
    }
  }, [campaignId]);

  return campaignListingPreference;
};

export default useSetOnceCampaignListingPreference;
