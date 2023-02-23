import { CampaignStatus } from "@custom-types/core/CampaignStatus";
import { CampaignType } from "@custom-types/core/CampaignType";
import { ActivityEntryReferenceHistory, EntryData } from "@reducers/entries/campaignEntriesReducer";
import { RootState } from "@reducers/index";

export const getHistoryList = (state: RootState, {
  entryKey, campaignId,
}: {
  entryKey: string, campaignId: number
}): ActivityEntryReferenceHistory[] => {
  return state.campaignEntries[campaignId]?.entries[entryKey]?.entryData?.activityEntryReferenceHistoryList ?? [];
}

export const cleanHistoryList = ({
  entry,
  list,
}: {
  entry: EntryData;
  list: ActivityEntryReferenceHistory[];
}) => {
  return list
  .filter(ae => ae.id !== entry.id)
  .filter(ae => ae.campaignType !== CampaignType.DRAFT)
  .filter(ae => ae.campaignStatus !== CampaignStatus.ARCHIVED)
  .sort((ae1, ae2) => ae1.campaignYear <= ae2.campaignYear ? -1 : 1);
}
