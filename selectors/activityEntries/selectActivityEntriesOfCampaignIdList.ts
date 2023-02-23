import { createSelector } from "reselect";

import { RootState } from "@reducers/index";
import { EntriesByCampaign } from "@lib/core/activityEntries/getCampaignsEntryInfoByActivityModel";

import selectActivityModelsInCartography from "@selectors/cartography/selectActivityModelsInCartography";

/**
 * Select entries for a list of campaign ids.
 * To take advantage of memoization when the campaign ids are the same, make sure to pass the same array reference
 */
const selectActivityEntriesOfCampaignIdList = createSelector(
  [
    (_: RootState, campaignIds: number[]) => campaignIds,
    (state: RootState) => state.campaignEntries,
    selectActivityModelsInCartography,
  ],
  (
    campaignIds,
    entriesBycampaign,
    visibleActivityModels
  ): EntriesByCampaign => {
    const visibleActivityModelsRecord = visibleActivityModels.reduce(
      (acc, activityModel) => {
        acc[activityModel.id] = true;
        return acc;
      },
      {} as Record<number, true>
    );
    return campaignIds.reduce((acc, campaignId) => {
      acc[Number(campaignId)] = Object.entries(
        entriesBycampaign[Number(campaignId)]?.entries ?? {}
      )
        .map(([key, entry]) => {
          return {
            ...entry.entryData,
            entryKey: key,
          };
        })
        .filter(entry => visibleActivityModelsRecord[entry.activityModelId]);
      return acc;
    }, {} as EntriesByCampaign);
  }
);

export default selectActivityEntriesOfCampaignIdList;
