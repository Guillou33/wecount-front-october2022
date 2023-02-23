import { call, takeLeading, put } from "redux-saga/effects";

import ApiClient from "@lib/wecount-api/ApiClient";
import { generateRoute, ApiRoutes } from "@lib/wecount-api/routes/apiRoutes";
import { ActivityEntryFullResponse } from "@lib/wecount-api/responses/apiResponses";

import { EntrySubmissionRequested } from "@actions/entries/campaignEntriesAction";
import { CampaignEntriesTypes } from "@actions/entries/campaignEntriesTypes";

import { apiRequestFailed } from "@actions/entries/campaignEntriesAction";

function* submitEntryForValidation(action: EntrySubmissionRequested) {
  const { campaignId, entryId, entryKey } = action.payload;

  const apiClient = ApiClient.buildFromBrowser();

  const submitCall = () =>
    apiClient.post<ActivityEntryFullResponse>(
      generateRoute(ApiRoutes.ACTIVITY_ENTRY_SUBMISSION, {
        campaignId,
        activityEntryId: entryId,
      }),
      {}
    );

  yield call(submitCall);

  try {
  } catch (error: any) {
    yield put(apiRequestFailed({ campaignId, entryKey }));
  }
}

export function* watchEntrySubmissions() {
  yield takeLeading(
    CampaignEntriesTypes.ENTRY_SUBMISSION_REQUESTED,
    submitEntryForValidation
  );
}
