import { Dispatch } from "redux";
import { CustomThunkAction } from "@custom-types/redux";
import { CampaignOpenedCategoriesTypes } from "./types";
import { ExpansionMode } from "@reducers/userPreference/campaignDashboardReducer";

export type Action =
  | SetOpenedCategories
  | ToggleCategory
  | SetLastExpansionMode;

interface SetOpenedCategories {
  type: CampaignOpenedCategoriesTypes.SET_OPENED_CATEGORIES;
  payload: {
    campaignId: number;
    openedCategories: number[];
  };
}

interface ToggleCategory {
  type: CampaignOpenedCategoriesTypes.TOGGLE_CATEGORY;
  payload: {
    campaignId: number;
    categoryId: number;
  };
}

interface SetLastExpansionMode {
  type: CampaignOpenedCategoriesTypes.SET_LAST_EXPANSION_MODE;
  payload: {
    campaignId: number;
    lastExpansionMode: ExpansionMode;
  };
}

export function expandAllCategories(campaignId: number): CustomThunkAction {
  return (dispatch: Dispatch, getState) => {
    const categoryList = getState().core.category.categoryList;
    const allCategoriesId = [
      ...Object.keys(categoryList.UPSTREAM),
      ...Object.keys(categoryList.CORE),
      ...Object.keys(categoryList.DOWNSTREAM),
    ];
    dispatch<SetOpenedCategories>({
      type: CampaignOpenedCategoriesTypes.SET_OPENED_CATEGORIES,
      payload: {
        campaignId,
        openedCategories: allCategoriesId.map(Number),
      },
    });
  };
}

export function closeAllCategories(campaignId: number): SetOpenedCategories {
  return {
    type: CampaignOpenedCategoriesTypes.SET_OPENED_CATEGORIES,
    payload: {
      campaignId,
      openedCategories: [],
    },
  };
}

export function setOpenedCategories(
  campaignId: number,
  openedCategories: number[]
): SetOpenedCategories {
  return {
    type: CampaignOpenedCategoriesTypes.SET_OPENED_CATEGORIES,
    payload: {
      campaignId,
      openedCategories,
    },
  };
}

export function toggleCategory(
  campaignId: number,
  categoryId: number
): ToggleCategory {
  return {
    type: CampaignOpenedCategoriesTypes.TOGGLE_CATEGORY,
    payload: {
      campaignId,
      categoryId,
    },
  };
}

export function setLastExpansionMode(
  campaignId: number,
  lastExpansionMode: ExpansionMode
): SetLastExpansionMode {
  return {
    type: CampaignOpenedCategoriesTypes.SET_LAST_EXPANSION_MODE,
    payload: {
      campaignId,
      lastExpansionMode,
    },
  };
}
