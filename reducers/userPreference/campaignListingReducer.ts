import { CampaignListingColumnTypes } from "@actions/userPreference/campaignListing/types";
import { Action } from "@actions/userPreference/campaignListing/campaignListingActions";
import { ListingColumn } from "@custom-types/wecount-api/campaignListing";

export interface UserPreferenceState {
  visibleColumns: CampaignListinPreferences;
}

export type OpenedCategories = { [key: number]: true };
export type CampaignListinPreferences = { [key: number]: ListingColumn[] };
export type CampaignOpenedCategoriesPreferences = {
  [key: number]: OpenedCategories;
};

const initialState: UserPreferenceState = {
  visibleColumns: {},
};

const reducer = (state: UserPreferenceState = initialState, action: Action) => {
  switch (action.type) {
    case CampaignListingColumnTypes.SET_CAMPAIGN_LISTING_PREFERENCES: {
      const { campaignId, visibleColumns } = action.payload;
      return {
        ...state,
        visibleColumns: {
          ...state.visibleColumns,
          [campaignId]: visibleColumns,
        },
      };
    }
    default:
      return state;
  }
};

export default reducer;
