import { call, takeLeading } from "redux-saga/effects";

import ApiClient from "@lib/wecount-api/ApiClient";
import { generateRoute, ApiRoutes } from "@lib/wecount-api/routes/apiRoutes";

import { DeleteEntryRequested } from "@actions/entries/campaignEntriesAction";
import { CampaignEntriesTypes } from "@actions/entries/campaignEntriesTypes";

function* deleteEntry(action: DeleteEntryRequested) {
  const { entryId, campaignId } = action.payload;
  const apiClient = ApiClient.buildFromBrowser();

  if (entryId) {
    const deleteCall = () =>
      apiClient.delete(
        generateRoute(ApiRoutes.ACTIVITY_ENTRY, {
          campaignId,
          activityEntryId: entryId,
        })
      );

    yield call(deleteCall);
  }
}

export function* watchDeleteRequests() {
  yield takeLeading(CampaignEntriesTypes.DELETE_ENTRY_REQUESTED, deleteEntry);
}
