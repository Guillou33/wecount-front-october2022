import { CampaignOpenedCategoriesTypes } from "@actions/userPreference/campaignDashboard/types";
import { Action } from "@actions/userPreference/campaignDashboard/campaignDashboardAction";
import { ListingColumn } from "@custom-types/wecount-api/campaignListing";

export interface UserPreferenceState {
  openedCategories: CampaignOpenedCategoriesPreferences;
  openedActivityModels: CampaignOpenedActivityModels;
  lastExpansionMode: CampaignExpansionMode;
}

export type OpenedCategories = { [key: number]: true };
export type OpenedActivityModels = { [key: number]: true };
export type CampaignListinPreferences = { [key: number]: ListingColumn[] };
export type CampaignOpenedCategoriesPreferences = {
  [key: number]: OpenedCategories;
};
export type CampaignOpenedActivityModels = {
  [key: number]: OpenedActivityModels;
};

export type ExpansionMode = "allFolded" | "allExpanded";
export type CampaignExpansionMode = {
  [key: number]: ExpansionMode;
};

const openedEntitiesBuilder = (isEntityOpened: boolean) =>
  isEntityOpened ? buildOpenedEntitiesRemoving : buildOpenedEntitiesAdding;

function buildOpenedEntitiesAdding(
  openedEntities: OpenedCategories,
  entityId: number
): OpenedCategories {
  return {
    ...openedEntities,
    [entityId]: true,
  };
}

function buildOpenedEntitiesRemoving(
  openedEntities: OpenedCategories,
  entityId: number
): OpenedCategories {
  const openedEntitiesCopy = { ...openedEntities };
  delete openedEntitiesCopy[entityId];
  return openedEntitiesCopy;
}
const initialState: UserPreferenceState = {
  openedCategories: {},
  openedActivityModels: {},
  lastExpansionMode: {},
};

const reducer = (state: UserPreferenceState = initialState, action: Action) => {
  switch (action.type) {
    case CampaignOpenedCategoriesTypes.SET_OPENED_CATEGORIES: {
      const { campaignId, openedCategories } = action.payload;
      const openedCategoriesById = openedCategories.reduce(
        (openedCategoriesById: OpenedCategories, categoryId) => {
          openedCategoriesById[categoryId] = true;
          return openedCategoriesById;
        },
        {}
      );
      return {
        ...state,
        openedCategories: {
          ...state.openedCategories,
          [campaignId]: openedCategoriesById,
        },
      };
    }
    case CampaignOpenedCategoriesTypes.TOGGLE_CATEGORY: {
      const { campaignId, categoryId } = action.payload;
      const campaignOpenedCategories = state.openedCategories[campaignId];
      const isCategoryOpened = campaignOpenedCategories?.[categoryId];
      const buildOpenedCategories = openedEntitiesBuilder(isCategoryOpened);
      return {
        ...state,
        openedCategories: {
          ...state.openedCategories,
          [campaignId]: buildOpenedCategories(
            campaignOpenedCategories,
            categoryId
          ),
        },
      };
    }
    case CampaignOpenedCategoriesTypes.SET_LAST_EXPANSION_MODE: {
      const { campaignId, lastExpansionMode } = action.payload;
      return {
        ...state,
        lastExpansionMode: {
          ...state.lastExpansionMode,
          [campaignId]: lastExpansionMode,
        },
      };
    }
    default:
      return state;
  }
};

export default reducer;
