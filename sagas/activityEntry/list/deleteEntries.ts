import { call, select, takeLeading } from "redux-saga/effects";

import ApiClient from "@lib/wecount-api/ApiClient";
import { generateRoute, ApiRoutes } from "@lib/wecount-api/routes/apiRoutes";

import { DeleteEntriesInListRequested } from "@actions/entries/campaignEntriesAction";
import { CampaignEntriesTypes } from "@actions/entries/campaignEntriesTypes";

function* deleteEntries(action: DeleteEntriesInListRequested) {
  const { list, campaignId } = action.payload;
  const apiClient = ApiClient.buildFromBrowser();

  if (list.length > 0) {
    const deleteCall = () =>
      apiClient.post<void>(
        generateRoute(ApiRoutes.ACTIVITY_ENTRIES_DELETE, {
          campaignId
        }), {
            list: list
        }
      );

    yield call(deleteCall);
  }
}

export function* watchDeleteEntriesRequests() {
  yield takeLeading(CampaignEntriesTypes.DELETE_ENTRIES_IN_SELECTION, deleteEntries);
}
