import { State as CampaignEntriesState } from "@reducers/entries/campaignEntriesReducer";
import { RootState } from "@reducers/index";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchAllEntriesOfCampaignsRequested } from "@actions/entries/campaignEntriesAction";

export default function useSetAllEntriesForMultipleCampaigns(campaignIds: number[]): void {
  const dispatch = useDispatch();

  const campaignEntries = useSelector<RootState, CampaignEntriesState>(
    state => state.campaignEntries
  );
  useEffect(() => {
    const campaignIdsMissing: number[] = [];
    campaignIds.forEach(campaignId => {
      if (campaignEntries[campaignId] == null) {
        campaignIdsMissing.push(campaignId);
      }
    });
    if (campaignIdsMissing.length) {
      dispatch(fetchAllEntriesOfCampaignsRequested({campaignIds: campaignIdsMissing}));
    }
  }, [campaignIds.join(',')]);
}
