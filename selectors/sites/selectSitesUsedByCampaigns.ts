import { createSelector } from "reselect";

import { RootState } from "@reducers/index";

import selectActivityEntriesOfCampaignIdList from "@selectors/activityEntries/selectActivityEntriesOfCampaignIdList";

export type SiteIdsByCampaignIds = Record<number, Record<number, true>>;

const selectSitesUsedByCampaigns = createSelector(
  [
    (_: RootState, campaignIds: number[]) => campaignIds,
    (state: RootState) => state.core.site.siteList,
    selectActivityEntriesOfCampaignIdList,
  ],
  (campaignIds, allSites, entriesBycampaignId): SiteIdsByCampaignIds => {
    return campaignIds.reduce((acc, campaignId) => {
      if (acc[campaignId] == null) {
        acc[campaignId] = {};
      }
      entriesBycampaignId[campaignId]?.reduce((acc, entry) => {
        const entrySiteId = entry.siteId;
        if (
          entrySiteId != null &&
          allSites[entrySiteId]?.archivedDate === null
        ) {
          acc[entrySiteId] = true;
        }
        return acc;
      }, acc[campaignId]);
      return acc;
    }, {} as SiteIdsByCampaignIds);
  }
);

export default selectSitesUsedByCampaigns;
