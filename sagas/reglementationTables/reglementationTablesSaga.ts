import { put, takeLatest, fork, call } from "redux-saga/effects";

import { Await } from "@lib/utils/awaitType";
import ApiClient from "@lib/wecount-api/ApiClient";
import { ApiRoutes, generateRoute } from "@lib/wecount-api/routes/apiRoutes";
import {
  ReglementationTablesResponse,
  TableType,
  ReglemetationResultsResponse,
} from "@lib/wecount-api/responses/apiResponses";

import formatReglementationTableStructure from "./helpers/formatReglementationTableStructure";

import { ReglementationTablesTypes } from "@actions/reglementationTables/types";
import {} from "@actions/reglementationTables/reglementationTablesActions";
import {
  ReglementationTableCampaignDataFetchRequested,
  reglementationTableCampaignDataFetched,
  setReglementationTable,
  reglementationTablesFetchFailed,
  reglementationTableCampaignDataFetchFailed,
} from "@actions/reglementationTables/reglementationTablesActions";

function* fetchReglementationTables() {
  const apiClient = ApiClient.buildFromBrowser();
  const fetchReglementationTablesCall = () =>
    apiClient.get<ReglementationTablesResponse>(
      generateRoute(ApiRoutes.REGLEMENTATION_TABLES_STRUCTURE)
    );
  try {
    const response: Await<ReturnType<typeof fetchReglementationTablesCall>> =
      yield call(fetchReglementationTablesCall);

    const { structure } = response.data;

    yield put(
      setReglementationTable({
        structure: formatReglementationTableStructure(structure),
      })
    );
  } catch (err) {
    yield put(reglementationTablesFetchFailed());
  }
}

function* fetchCampaignData<T extends TableType>(
  action: ReglementationTableCampaignDataFetchRequested<T>
) {
  const apiClient = ApiClient.buildFromBrowser();
  const { campaignId, tableType } = action.payload;
  const fetchDataCall = () =>
    apiClient.get<ReglemetationResultsResponse<T>>(
      generateRoute(ApiRoutes.REGLEMENTATION_TABLES_DATA, {
        campaignId,
        tableCode: tableType,
      })
    );
  try {
    const response: Await<ReturnType<typeof fetchDataCall>> = yield call(
      fetchDataCall
    );

    const { activityEntryResults } = response.data;

    yield put(
      reglementationTableCampaignDataFetched({
        campaignId,
        tableType,
        data: activityEntryResults,
      })
    );
  } catch (err) {
    yield put(
      reglementationTableCampaignDataFetchFailed({ campaignId, tableType })
    );
  }
}

function* watchFetchRequests() {
  yield takeLatest(
    ReglementationTablesTypes.REGLEMENTATION_TABLES_FETCH_REQUESTED,
    fetchReglementationTables
  );
}

function* watchFetchCampaignDataRequests() {
  yield takeLatest(
    ReglementationTablesTypes.REGLEMENTATION_TABLES_CAMPAIGN_DATA_FETCH_REQUESTED,
    fetchCampaignData
  );
}

const reglementationTablesSagas = [
  fork(watchFetchRequests),
  fork(watchFetchCampaignDataRequests),
];

export default reglementationTablesSagas;
