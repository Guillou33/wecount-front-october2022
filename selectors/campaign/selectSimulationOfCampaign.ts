import { createSelector } from "reselect";

import { CampaignWithInformation } from "@selectors/campaign/selectCampaignsAvailableForHistory";
import { CampaignType } from "@custom-types/core/CampaignType";
import { RootState } from "@reducers/index";

const selectSimulationOfCampaign = createSelector(
  [
    (state: RootState) => state.campaign.campaigns,
    (_: RootState, campaignId: number) => campaignId,
  ],
  (allCampaigns, campaignId) => {
    const currentCampaignInfo = allCampaigns[campaignId]?.information;
    if (
      currentCampaignInfo == null ||
      currentCampaignInfo.type !== CampaignType.CARBON_FOOTPRINT
    ) {
      return null;
    }
    const simulationCampaign =
      Object.values(allCampaigns).find(
        campaign =>
          campaign.information != null &&
          campaign.information.type === CampaignType.SIMULATION &&
          campaign.information.year === currentCampaignInfo.year
      ) ?? null;
    return simulationCampaign as CampaignWithInformation;
  }
);

export default selectSimulationOfCampaign;
