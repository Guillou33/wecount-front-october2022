import { createSelector } from "reselect";

import { RootState } from "@reducers/index";
import { CampaignType } from "@custom-types/core/CampaignType";
import { Campaign } from "@reducers/campaignReducer";
import { CampaignStatus } from "@custom-types/core/CampaignStatus";

const getUnavailableYearsForType = ({
  campaigns,
  campaignType,
}: {
  campaigns: {
    [key: number]: Campaign;
  };
  campaignType: CampaignType;
}) => {
  const campaignsOfType = Object.values(campaigns).filter(campaign => campaign?.information?.type === campaignType);
  const unavailableYears = campaignsOfType.reduce<number[]>((years, campaign) => {
    if (campaign.information?.status === CampaignStatus.ARCHIVED) {
      return years;
    }
    if (years.indexOf(campaign.information?.year!) === -1) {
      years.push(campaign.information?.year!);
    }
    return years;
  }, []);

  return unavailableYears;
};

const selectUnavailableYears = createSelector(
  (state: RootState) => state.campaign.campaigns,
  campaigns => ({
    [CampaignType.CARBON_FOOTPRINT]: getUnavailableYearsForType({campaigns, campaignType: CampaignType.CARBON_FOOTPRINT}),
    [CampaignType.SIMULATION]: getUnavailableYearsForType({campaigns, campaignType: CampaignType.SIMULATION}),
    [CampaignType.DRAFT]: getUnavailableYearsForType({campaigns, campaignType: CampaignType.DRAFT}),
  })
);

export default selectUnavailableYears;
