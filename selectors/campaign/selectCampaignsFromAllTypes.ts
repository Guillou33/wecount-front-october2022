import { createSelector } from "reselect";

import { RootState } from "@reducers/index";
import { Campaign } from "@reducers/campaignReducer";
import { CampaignType } from "@custom-types/core/CampaignType";

const selectCampaignsFromAllTypes = createSelector(
  (state: RootState) => state.campaign.campaigns,
  allCampaigns =>
    Object.entries(allCampaigns).reduce((acc, [key, campaign]) => {
        acc[Number(key)] = campaign;
      return acc;
    }, {} as Record<number, Campaign>)
);

export default selectCampaignsFromAllTypes;
