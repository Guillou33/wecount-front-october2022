import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from "@reducers/index";
import { State as CampaignEntriesState } from "@reducers/entries/campaignEntriesReducer";

import { requestFetchAllEntries } from "@actions/entries/campaignEntriesAction";

export default function useSetAllEntries(campaignId: number | null): void {
  const dispatch = useDispatch();

  const campaignEntries = useSelector<RootState, CampaignEntriesState>(
    state => state.campaignEntries
  );
  useEffect(() => {
    if (campaignId && campaignEntries[campaignId] == null) {
      dispatch(requestFetchAllEntries(campaignId));
    }
  }, [campaignId]);
}
