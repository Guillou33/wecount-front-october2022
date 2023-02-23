import { takeLatest, call, put, fork, takeEvery } from "redux-saga/effects";
import { ApiRoutes, generateRoute } from "@lib/wecount-api/routes/apiRoutes";
import ApiClient from "@lib/wecount-api/ApiClient";
import { Await } from "@lib/utils/awaitType";
import { CustomEmissionFactorResponse } from "@lib/wecount-api/responses/apiResponses";
import { ArchiveRequestedAction, RequestCreationAction, requestFetchCustomEmissionFactors, RequestUpdateAction, setCreationEnd, setCustomEmissionFactorFetched, UnarchiveRequestedAction, setCreationError } from "@actions/core/customEmissionFactor/customEmissionFactorActions";
import { CustomEmissionFactorTypes } from "@actions/core/customEmissionFactor/types";

function* fetchAll() {
  const apiClient = ApiClient.buildFromBrowser();
  const fetchCall = () =>
    apiClient.get<CustomEmissionFactorResponse[]>(
      generateRoute(ApiRoutes.CUSTOM_EMISSION_FACTORS),
      true
    );

  const response: Await<ReturnType<typeof fetchCall>> = yield call(fetchCall);

  yield put(setCustomEmissionFactorFetched(response.data));
}

function* create(action: RequestCreationAction) {
  const apiClient = ApiClient.buildFromBrowser();
  
  const createCall = () =>
    apiClient.post<CustomEmissionFactorResponse>(
      generateRoute(ApiRoutes.CUSTOM_EMISSION_FACTORS),
      {
        perimeterId: action.payload.perimeterId,
        value: action.payload.value,
        name: action.payload.name,
        input1Name: action.payload.input1Name,
        input1Unit: action.payload.input1Unit,
        source: action.payload.source,
        comment: action.payload.comment,
      }
    );

  try {
    const response: Await<ReturnType<typeof createCall>> = yield call(createCall);
    yield put(setCreationEnd());
    yield put(requestFetchCustomEmissionFactors());
  } catch (error) {
    yield put(setCreationError());
  }
}

function* update(action: RequestUpdateAction) {
  const apiClient = ApiClient.buildFromBrowser();
  const createCall = () =>
    apiClient.put<CustomEmissionFactorResponse>(
      generateRoute(ApiRoutes.CUSTOM_EMISSION_FACTOR, {
        cefId: action.payload.cefId,
      }),
      {
        cefId: action.payload.cefId,
        value: action.payload.value,
        name: action.payload.name,
        input1Name: action.payload.input1Name,
        input1Unit: action.payload.input1Unit,
        source: action.payload.source,
        comment: action.payload.comment,
      }
    );

  const response: Await<ReturnType<typeof createCall>> = yield call(createCall);

  yield put(requestFetchCustomEmissionFactors());
}

function* archive(action: ArchiveRequestedAction) {
  const apiClient = ApiClient.buildFromBrowser();

  const archiveCall = () =>
    apiClient.post<void>(
      generateRoute(ApiRoutes.ARCHIVE_CUSTOM_EMISSION_FACTOR, {
        cefId: action.payload.cefId,
      }),
      {}
    );
  const response: Await<ReturnType<typeof archiveCall>> = yield call(
    archiveCall
  );
}

function* unarchive(action: UnarchiveRequestedAction) {
  const apiClient = ApiClient.buildFromBrowser();

  const unarchiveCall = () =>
    apiClient.post<void>(
      generateRoute(ApiRoutes.UNARCHIVE_CUSTOM_EMISSION_FACTOR, {
        cefId: action.payload.cefId,
      }),
      {}
    );
  const response: Await<ReturnType<typeof unarchiveCall>> = yield call(
    unarchiveCall
  );
}

function* watchFetchRequested() {
  yield takeLatest(CustomEmissionFactorTypes.REQUEST_FETCH_CUSTOM_EMISSION_FACTOR, fetchAll);
}
function* watchCreationRequested() {
  yield takeLatest(CustomEmissionFactorTypes.REQUEST_CREATION_CUSTOM_EMISSION_FACTOR, create);
}
function* watchUpdateRequested() {
  yield takeLatest(CustomEmissionFactorTypes.REQUEST_UPDATE_CUSTOM_EMISSION_FACTOR, update);
}
function* watchArchiveRequested() {
  yield takeEvery(CustomEmissionFactorTypes.ARCHIVE_REQUESTED, archive);
}
function* watchUnarchiveRequested() {
  yield takeEvery(CustomEmissionFactorTypes.UNARCHIVE_REQUESTED, unarchive);
}

const customEmissionFactorSagas = [
  fork(watchFetchRequested),
  fork(watchCreationRequested),
  fork(watchUpdateRequested),
  fork(watchArchiveRequested),
  fork(watchUnarchiveRequested),
];

export default customEmissionFactorSagas;
