import { call, takeLatest, put } from "redux-saga/effects";

import { Await } from "@lib/utils/awaitType";
import ApiClient from "@lib/wecount-api/ApiClient";
import { generateRoute, ApiRoutes } from "@lib/wecount-api/routes/apiRoutes";

import { ActivityEntryResponse } from "@lib/wecount-api/responses/apiResponses";
import { UpdateEntryRequested } from "@actions/entries/campaignEntriesAction";
import { CampaignEntriesTypes } from "@actions/entries/campaignEntriesTypes";

import {
  updateEntry,
  apiRequestFailed,
} from "@actions/entries/campaignEntriesAction";

function* updateEntrySaga(action: UpdateEntryRequested) {
  const { campaignId, entryKey, entryId, activityModelId } = action.payload;

  const apiClient = ApiClient.buildFromBrowser();
  try {
    if (entryId != null) {
      const updateCall = () =>
        apiClient.put<ActivityEntryResponse>(
          generateRoute(ApiRoutes.ACTIVITY_ENTRY, {
            campaignId,
            activityEntryId: entryId,
          }),
          {
            ...action.payload.entryData,
          }
        );

      const response: Await<ReturnType<typeof updateCall>> = yield call(
        updateCall
      );

      yield put(
        updateEntry({
          campaignId,
          entryKey,
          entryData: {
            ...action.payload.entryData,
            ...response.data,
          },
        })
      );
    } else {
      const postCall = () =>
        apiClient.post<ActivityEntryResponse>(
          generateRoute(ApiRoutes.ACTIVITY_ENTRIES, {
            campaignId,
          }),
          {
            ...action.payload.entryData,
            activityModelId,
          }
        );

      const response: Await<ReturnType<typeof postCall>> = yield call(postCall);

      yield put(
        updateEntry({
          campaignId,
          entryKey,
          entryData: {
            ...action.payload.entryData,
            ...response.data,
          },
        })
      );
    }
  } catch (error: any) {
    yield put(apiRequestFailed({ campaignId, entryKey }));
  }
}

export function* watchUpdateEntryRequests() {
  yield takeLatest(
    CampaignEntriesTypes.UPDATE_ENTRY_REQUESTED,
    updateEntrySaga
  );
}
