import { createSelector } from "reselect";

import { RootState } from "@reducers/index";
import { EntriesByCampaign } from "@lib/core/activityEntries/getCampaignsEntryInfoByActivityModel";

import selectActivityModelsInCartography from "@selectors/cartography/selectActivityModelsInCartography";
import selectCampaignsAvailableForHistory from "@selectors/campaign/selectCampaignsAvailableForHistory";

const selectActivityEntriesOfAllCarbonFootprintCampaigns = createSelector(
  [
    selectCampaignsAvailableForHistory,
    (state: RootState) => state.campaignEntries,
    selectActivityModelsInCartography,
  ],
  (
    campaignsAvailableForHistory,
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
    return Object.keys(campaignsAvailableForHistory).reduce(
      (acc, campaignId) => {
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
      },
      {} as EntriesByCampaign
    );
  }
);

export default selectActivityEntriesOfAllCarbonFootprintCampaigns;
