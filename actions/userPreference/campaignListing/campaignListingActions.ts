import { Dispatch } from "redux";
import ApiClient from "@lib/wecount-api/ApiClient";
import { CustomThunkAction } from "@custom-types/redux";
import { ApiRoutes, generateRoute } from "@lib/wecount-api/routes/apiRoutes";
import { UserPeferencesCampaignListingResponse } from "@lib/wecount-api/responses/apiResponses";
import { CampaignListingColumnTypes } from "./types";
import { ListingColumn } from "@custom-types/wecount-api/campaignListing";

export type Action = SetCampaignListingPreferencesAction;

interface SetCampaignListingPreferencesAction {
  type: CampaignListingColumnTypes.SET_CAMPAIGN_LISTING_PREFERENCES;
  payload: {
    campaignId: number;
    visibleColumns: ListingColumn[];
  };
}

export function loadCampaignListingPreferences(
  campaignId: number,
  customApiClient?: ApiClient
): CustomThunkAction {
  return async (dispatch: Dispatch) => {
    const apiClient = customApiClient ?? ApiClient.buildFromBrowser();
    const response = await apiClient.get<UserPeferencesCampaignListingResponse>(
      generateRoute(ApiRoutes.USER_PREFERENCES_CAMPAIGN_LISTING, { campaignId })
    );

    dispatch<SetCampaignListingPreferencesAction>({
      type: CampaignListingColumnTypes.SET_CAMPAIGN_LISTING_PREFERENCES,
      payload: {
        campaignId,
        visibleColumns: response.data.columns,
      },
    });
  };
}

export function editCampaignListingColumn(
  campaignId: number,
  column: ListingColumn,
  isVisible: boolean
): CustomThunkAction {
  return async (dispatch: Dispatch, getState) => {
    const campaignListingPreference = getState().userPreference.campaignListing
      .visibleColumns[campaignId];
    const getNewColumnList = getColumnEditor(isVisible);
    const visibleColumns = getNewColumnList(campaignListingPreference, column);

    dispatch<SetCampaignListingPreferencesAction>({
      type: CampaignListingColumnTypes.SET_CAMPAIGN_LISTING_PREFERENCES,
      payload: {
        campaignId,
        visibleColumns,
      },
    });

    const apiClient = ApiClient.buildFromBrowser();
    await apiClient.post(
      generateRoute(ApiRoutes.USER_PREFERENCES_CAMPAIGN_LISTING, {
        campaignId,
      }),
      {
        columns: visibleColumns,
      }
    );
  };
}

function getColumnEditor(add: boolean) {
  return add ? getNewColumnListAdding : getNewColumnListRemoving;
}

function getNewColumnListAdding(
  columnList: ListingColumn[],
  column: ListingColumn
) {
  return [...columnList, column];
}

function getNewColumnListRemoving(
  columnList: ListingColumn[],
  column: ListingColumn
) {
  const columnToRemoveIndex = columnList.indexOf(column);
  return [
    ...columnList.slice(0, columnToRemoveIndex),
    ...columnList.slice(columnToRemoveIndex + 1),
  ];
}
