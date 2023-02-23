import { createSelector } from "reselect";
import { RootState } from "@reducers/index";
import { CampaignStatus } from "@custom-types/core/CampaignStatus";


const selectUnarchivedCampaignNumber = createSelector(
  (state: RootState) => state.campaign.campaigns,
  campaigns => {
    return Object.values(campaigns).reduce((unarchivedNb, campaign) => {
      return (campaign.information && campaign.information.status !== CampaignStatus.ARCHIVED) ? unarchivedNb + 1 : unarchivedNb;
    }, 0);
  }
);

export default selectUnarchivedCampaignNumber;
