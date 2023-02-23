import { RootState } from "@reducers/index";

function selectAreCampaignEntriesFetched(
  state: RootState,
  campaignId: number | null
): boolean {
  if (campaignId == null) {
    return true;
  }
  return state.campaignEntries[campaignId] != null;
}

export default selectAreCampaignEntriesFetched;
