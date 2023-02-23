import { takeLeading, fork, call, put } from "redux-saga/effects";

import ApiClient from "@lib/wecount-api/ApiClient";
import { generateRoute, ApiRoutes } from "@lib/wecount-api/routes/apiRoutes";

import { DataImportErrors } from "@reducers/dataImport/entryDataReducer";
import { DataImportTypes } from "@actions/dataImport/entryData/types";
import {
  SaveDataRequested,
  dataSaved,
  dataSavingFailed,
} from "@actions/dataImport/entryData/entryDataActions";

function* saveData(action: SaveDataRequested) {
  const apiClient = ApiClient.buildFromBrowser();

  const { campaignId, data } = action.payload;

  const createCall = () =>
    apiClient.post<void>(
      generateRoute(ApiRoutes.CAMPAIGNS_CREATE_MULTIPLE_ENTRIES, {
        id: campaignId,
      }),
      data
    );

  try {
    yield call(createCall);
    yield put(dataSaved({ campaignId }));
  } catch (err: any) {
    let error: DataImportErrors = "other";

    if (err.response?.status === 400) {
      error = "bad-input";
    } else if (err.response?.status === 403) {
      error = "forbidden";
    }

    yield put(dataSavingFailed({ error }));
  }
}

function* watchSaveRequested() {
  yield takeLeading(DataImportTypes.SAVE_DATA_REQUESTED, saveData);
}

const dataImportSagas = [fork(watchSaveRequested)];

export default dataImportSagas;
