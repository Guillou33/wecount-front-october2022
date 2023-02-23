import { createSelector } from "reselect";

import { RootState } from "@reducers/index";
import { Campaign } from "@reducers/campaignReducer";
import { CampaignInformation } from "@reducers/campaignReducer";
import { CampaignType } from "@custom-types/core/CampaignType";
import { CampaignStatus } from "@custom-types/core/CampaignStatus";

export type CampaignWithInformation = Campaign & {
  information: CampaignInformation;
};

const validCampaignTypes = [
  CampaignType.CARBON_FOOTPRINT,
  CampaignType.SIMULATION,
];

const selectCampaignsAvailableForHistory = createSelector(
  (state: RootState) => state.campaign.campaigns,
  allCampaigns => {
    const campaignByYear = Object.values(allCampaigns).reduce(
      (acc, campaign) => {
        const campaignInfo = campaign.information;
        if (
          campaignInfo != null &&
          validCampaignTypes.includes(campaignInfo.type) &&
          campaignInfo.status !== CampaignStatus.ARCHIVED
        ) {
          if (
            acc[campaignInfo.year] == null ||
            campaignInfo.type === CampaignType.CARBON_FOOTPRINT
          )
            acc[campaignInfo.year] = campaign;
        }
        return acc;
      },
      {} as Record<number, Campaign>
    );
    return Object.values(campaignByYear).reduce((acc, campaign) => {
      const campaignInfo = campaign.information;
      if (campaignInfo != null) {
        acc[campaignInfo.id] = campaign as CampaignWithInformation;
      }
      return acc;
    }, {} as Record<number, CampaignWithInformation>);
  }
);

export default selectCampaignsAvailableForHistory;
