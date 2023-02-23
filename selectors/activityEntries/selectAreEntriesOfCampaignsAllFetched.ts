import { createSelector } from "reselect";

import { RootState } from "@reducers/index";

const selectAreEntriesOfCampaignsAllFetched = createSelector(
  [
    (_: RootState, campaignIds: number[]) => campaignIds,
    (state: RootState) => state.campaignEntries,
  ],
  (campaignIds, campaignEntries) => {
    return campaignIds.every(
      campaignId => campaignEntries[campaignId] !== undefined
    );
  }
);

export default selectAreEntriesOfCampaignsAllFetched;
