import { useSelector, useDispatch } from "react-redux";
import { useEffect, useMemo } from "react";
import { RootState } from "@reducers/index";
import selectCampaignsAvailableForHistory from "@selectors/campaign/selectCampaignsAvailableForHistory";
import { fetchAllEntriesOfCampaignsRequested } from "@actions/entries/campaignEntriesAction";

function useSetOnceEntriesOfCampaignsAvailableForHistory() {
  const dispatch = useDispatch();

  const campaignsAvailableForHistory = useSelector(
    selectCampaignsAvailableForHistory
  );
  const entriesOfAllCAmpaigns = useSelector(
    (state: RootState) => state.campaignEntries
  );

  const campaignIdsNeedingFetching = useMemo(
    () =>
      Object.keys(campaignsAvailableForHistory).reduce((acc, campaignId) => {
        if (entriesOfAllCAmpaigns[Number(campaignId)] == null) {
          acc.push(Number(campaignId));
        }
        return acc;
      }, [] as number[]),
    [campaignsAvailableForHistory, entriesOfAllCAmpaigns]
  );

  useEffect(() => {
    if (campaignIdsNeedingFetching.length > 0) {
      dispatch(
        fetchAllEntriesOfCampaignsRequested({
          campaignIds: campaignIdsNeedingFetching,
        })
      );
    }
  }, [campaignIdsNeedingFetching]);
}

export default useSetOnceEntriesOfCampaignsAvailableForHistory;
