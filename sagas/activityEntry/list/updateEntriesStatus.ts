import { setAllEntries, setEntriesSelectedStatus, SetStatusForEntries } from "@actions/entries/campaignEntriesAction";
import { CampaignEntriesTypes } from "@actions/entries/campaignEntriesTypes";
import { Await } from "@lib/utils/awaitType";
import ApiClient from "@lib/wecount-api/ApiClient";
import { ActivityEntryFullResponse } from "@lib/wecount-api/responses/apiResponses";
import { ApiRoutes, generateRoute } from "@lib/wecount-api/routes/apiRoutes";
import { getCurrentCampaign } from "@selectors/campaign/selectCurrentCampaign";
import { call, put, select, takeLatest } from "redux-saga/effects";
import { formatEntryResponse } from "../helpers/formatEntryResponse";

function* updateEntriesStatus(action: SetStatusForEntries) {
  const {
    status, 
    list, 
  } = action.payload;

  const apiClient = ApiClient.buildFromBrowser();

  const {
      campaign,
      cardExpansionName
  } = yield select(getCurrentCampaign);

  const campaignId = campaign.currentCampaign;

  try{

    const updateEntriesStatusCall = () =>
      apiClient.put<ActivityEntryFullResponse[]>(
        generateRoute(ApiRoutes.ACTIVITY_ENTRIES_LIST, { campaignId }), {
            list: list,
            status: status,
        }
    );

    const response: Await<ReturnType<typeof updateEntriesStatusCall>> = yield call(
      updateEntriesStatusCall
    );

    yield put(
      setEntriesSelectedStatus({ 
        campaignId, 
        entries: response.data.map(formatEntryResponse), 
        cardExpansionName 
      })
    );
  } catch (error: any) {
    // yield put(apiRequestFailed({ campaignId, entryKey }));
  }
}

export function* watchUpdateEntriesStatus() {
    yield takeLatest(
      CampaignEntriesTypes.SET_STATUS_FOR_ENTRIES,
      updateEntriesStatus
    );
  }
  