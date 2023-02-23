import { call, takeLatest, put, all } from "redux-saga/effects";

import { Await } from "@lib/utils/awaitType";
import ApiClient from "@lib/wecount-api/ApiClient";
import { generateRoute, ApiRoutes } from "@lib/wecount-api/routes/apiRoutes";

import { ActivityEntryFullResponse } from "@lib/wecount-api/responses/apiResponses";
import { EntryData } from "@reducers/entries/campaignEntriesReducer";
import {
  FetchAllEntriesRequested,
  FetchAllEntriesOfCampaignsRequested,
} from "@actions/entries/campaignEntriesAction";
import { CampaignEntriesTypes } from "@actions/entries/campaignEntriesTypes";

import {
  setAllEntries,
  setAllEntriesOfCampaigns,
} from "@actions/entries/campaignEntriesAction";

import { formatEntryResponse } from "./helpers/formatEntryResponse";

function* fetchCampaignEntries(action: FetchAllEntriesRequested) {
  const {
    campaignId,
    customApiClient: apiClient = ApiClient.buildFromBrowser(),
  } = action.payload;

  const fetchEntriesCall = () =>
    apiClient.get<ActivityEntryFullResponse[]>(
      generateRoute(ApiRoutes.ACTIVITY_ENTRIES, { campaignId })
    );

  const response: Await<ReturnType<typeof fetchEntriesCall>> = yield call(
    fetchEntriesCall
  );

  yield put(
    setAllEntries({
      campaignId,
      entries: response.data.map(formatEntryResponse),
    })
  );
}

function* fetchEntriesOfCampaigns(action: FetchAllEntriesOfCampaignsRequested) {
  const apiClient = ApiClient.buildFromBrowser();
  const { campaignIds } = action.payload;

  const fetchEntriesOfCampaignsCalls = campaignIds.map(campaignId => {
    return async () => {
      const response = await apiClient.get<ActivityEntryFullResponse[]>(
        generateRoute(ApiRoutes.ACTIVITY_ENTRIES, { campaignId })
      );
      return {
        entries: response.data.map(formatEntryResponse),
        campaignId,
      };
    };
  });
  try {
    const responses: Await<{ entries: EntryData[]; campaignId: number }[]> =
      yield all(fetchEntriesOfCampaignsCalls.map(fetchCall => call(fetchCall)));
      yield put(setAllEntriesOfCampaigns(responses));
  } catch (err) {
    console.log(err);
  }

}

export function* watchFetchRequests() {
  yield takeLatest(
    CampaignEntriesTypes.FETCH_ALL_ENTRIES_REQUESTED,
    fetchCampaignEntries
  );
}

export function* watchFetchEntriesOfCampaignsRequests() {
  yield takeLatest(
    CampaignEntriesTypes.FETCH_ALL_ENTRIES_OF_CAMPAIGNS_REQUESTED,
    fetchEntriesOfCampaigns
  );
}
