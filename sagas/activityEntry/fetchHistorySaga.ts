import { call, takeLatest, put } from "redux-saga/effects";

import { Await } from "@lib/utils/awaitType";
import ApiClient from "@lib/wecount-api/ApiClient";
import { generateRoute, ApiRoutes } from "@lib/wecount-api/routes/apiRoutes";

import { ActivityEntryHistoryResponse } from "@lib/wecount-api/responses/apiResponses";
import { FetchHistoryRequested, setHistoryFetched } from "@actions/entries/campaignEntriesAction";
import { CampaignEntriesTypes } from "@actions/entries/campaignEntriesTypes";

function* fetchReferenceHistory(action: FetchHistoryRequested) {
  const apiClient = ApiClient.buildFromBrowser();

  const fetchHistoryCall = () =>
    apiClient.get<ActivityEntryHistoryResponse[]>(
      generateRoute(ApiRoutes.ACTIVITY_ENTRY_HISTORY, { 
        campaignId: action.payload.campaignId,
        activityEntryId: action.payload.activityEntryId,
      })
    );

  const response: Await<ReturnType<typeof fetchHistoryCall>> = yield call(
    fetchHistoryCall
  );

  yield put(
    setHistoryFetched({
      campaignId: action.payload.campaignId,
      activityEntryId: action.payload.activityEntryId,
      activityEntryKey: action.payload.activityEntryKey,
      activityEntryReferenceHistoryList: response.data.map(entry => {
        return {
          campaignYear: entry.activity.campaign.year,
          campaignStatus: entry.activity.campaign.status,
          campaignType: entry.activity.campaign.type,
          id: entry.id,
          emissionFactor: entry.emissionFactor,
          customEmissionFactor: entry.customEmissionFactor,
          createdAt: entry.createdAt,
          updatedAt: entry.updatedAt,
          value: entry.value,
          value2: entry.value2,
          uncertainty: entry.uncertainty,
          resultTco2: entry.resultTco2,
          title: entry.title,
          description: entry.description,
          instruction: entry.instruction,
          dataSource: entry.dataSource,
          manualTco2: entry.manualTco2,
          manualUnitNumber: entry.manualUnitNumber,
          computeMethodType: entry.computeMethodType,
          computeMethod: entry.computeMethod,
          input1Unit: entry.input1Unit,
          input2Unit: entry.input2Unit,
          ownerId: entry.ownerId,
          writerId: entry.writerId,
          entryTagIds: entry.entryTagMappings.map(
            entryTagMapping => entryTagMapping.entryTagId
          ),
        };
      }),
    })
  );
}

export function* watchHistoryFetchRequests() {
  yield takeLatest(
    CampaignEntriesTypes.FETCH_HISTORY_REQUESTED,
    fetchReferenceHistory
  );
}
