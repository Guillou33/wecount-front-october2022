import { createSelector } from "reselect";

import selectCampaignsAvailableForHistory from "@selectors/campaign/selectCampaignsAvailableForHistory";

import { RootState } from "@reducers/index";
import { CampaignWithInformation } from "@selectors/campaign/selectCampaignsAvailableForHistory";

const selectCampaignsAvailableForHistoryWithCurrentCampaign = createSelector(
  [
    (state: RootState) => state.campaign.campaigns,
    (state: RootState) => state.campaign.currentCampaign,
    selectCampaignsAvailableForHistory,
  ],
  (allCampaigns, currentCampaignId, campaignsAvailableForHistory) => {
    const currentCampaign =
      currentCampaignId != null ? allCampaigns[currentCampaignId] : null;

    if (currentCampaign == null || currentCampaign.information == null) {
      return campaignsAvailableForHistory;
    }

    return Object.values(campaignsAvailableForHistory).reduce(
      (acc, campaign) => {
        if (
          currentCampaign.information != null &&
          campaign.information.year === currentCampaign.information.year
        ) {
          acc[currentCampaign.information.id] =
            currentCampaign as CampaignWithInformation;
        } else {
          acc[campaign.information.id] = campaign;
        }
        return acc;
      },
      {} as Record<number, CampaignWithInformation>
    );
  }
);

export default selectCampaignsAvailableForHistoryWithCurrentCampaign;
