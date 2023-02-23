import { memoize } from "lodash";
import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";
import { EntriesByCampaign } from "@lib/core/activityEntries/getCampaignsEntryInfoByActivityModel";

export type HistoryOfEntries = Record<string, EntriesHistory>;

export type EntriesHistory = {
  referenceId: string;
  entriesBycampaignId: Record<number, ActivityEntryExtended>;
};

function getHistoryFromEntries(
  entriesByCampaigns: EntriesByCampaign
): HistoryOfEntries {
  return Object.entries(entriesByCampaigns).reduce(
    (campaignsHistory, [campaignId, campaignEntries]) => {
      campaignEntries.forEach(entry => {
        const entryHistoryId = entry.activityEntryReference?.referenceId;
        if (entryHistoryId != null) {
          if (campaignsHistory[entryHistoryId] == null) {
            // initialize new history
            campaignsHistory[entryHistoryId] = {
              referenceId: entryHistoryId,
              entriesBycampaignId: {},
            };
          }
          campaignsHistory[entryHistoryId].entriesBycampaignId[
            Number(campaignId)
          ] = entry;
        }
      });
      return campaignsHistory;
    },
    {} as HistoryOfEntries
  );
}

export default memoize(getHistoryFromEntries);
