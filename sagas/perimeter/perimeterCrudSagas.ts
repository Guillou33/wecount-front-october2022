import {
  call,
  takeEvery,
  fork,
  put,
  takeLeading,
  takeLatest,
} from "redux-saga/effects";

import { Await } from "@lib/utils/awaitType";
import ApiClient from "@lib/wecount-api/ApiClient";

import { ApiRoutes, generateRoute } from "@lib/wecount-api/routes/apiRoutes";
import { PerimeterFullResponse, PerimeterResponse } from "@lib/wecount-api/responses/apiResponses";

import {
  PerimeterCreationRequested,
  PerimeterDeletionRequested,
  PerimeterUpdateRequested,
  appendPerimeter,
  setPerimeterCreating,
  updatePerimeter as editPerimeterInState,
  removePerimeter,
  requestCurrentPerimeterSwitch,
  setPerimetersEmissionsFromApi,
} from "@actions/perimeter/perimeterActions";
import { PerimeterTypes } from "@actions/perimeter/types";

function* createPerimeter(action: PerimeterCreationRequested) {
  const apiClient = ApiClient.buildFromBrowser();
  yield put(setPerimeterCreating(true));

  const createPerimeterCall = () =>
    apiClient.post<PerimeterResponse>(
      generateRoute(ApiRoutes.PERIMETERS),
      action.payload
    );

  const response: Await<ReturnType<typeof createPerimeterCall>> = yield call(
    createPerimeterCall
  );

  const { id, name, description = null } = response.data;

  yield put(setPerimeterCreating(false));

  yield put(appendPerimeter({ id, name, description }));

  yield put(requestCurrentPerimeterSwitch(id));

}

function* watchPerimeterCreationRequested() {
  yield takeEvery(PerimeterTypes.PERIMETER_CREATION_REQUESTED, createPerimeter);
}

function* deletePerimeter(action: PerimeterDeletionRequested) {
  const apiClient = ApiClient.buildFromBrowser();
  yield put(removePerimeter(action.payload));

  const deleteCall = () =>
    apiClient.delete(
      generateRoute(ApiRoutes.PERIMETER, { id: action.payload })
    );

  yield call(deleteCall);
}

function* watchPerimeterDeletionRequested() {
  yield takeLeading(
    PerimeterTypes.PERIMETER_DELETION_REQUESTED,
    deletePerimeter
  );
}

function* updatePerimeter(action: PerimeterUpdateRequested) {
  const apiClient = ApiClient.buildFromBrowser();
  const { id, name, description } = action.payload;

  yield put(editPerimeterInState(action.payload));

  const updateCall = () =>
    apiClient.put<PerimeterResponse>(
      generateRoute(ApiRoutes.PERIMETER, { id }),
      {
        name,
        description,
      }
    );

  yield call(updateCall);
}

function* watchPerimeterUpdateRequested() {
  yield takeLatest(PerimeterTypes.PERIMETER_UPDATE_REQUESTED, updatePerimeter);
}

function* getPerimeterEmissions(){
  const apiClient = ApiClient.buildFromBrowser();

  const getEmissionsCall = () => 
    apiClient.get<PerimeterFullResponse>(
      ApiRoutes.PERIMETERS_EMISSIONS_SYNTHESIS
    );
  const response: Await<ReturnType<typeof getEmissionsCall>> = yield call(
    getEmissionsCall
  );

  yield put(setPerimetersEmissionsFromApi(response.data));

}

function* watchPerimeterEmissionsRequested() {
  yield takeLatest(
    PerimeterTypes.SET_PERIMETER_CREATING,
    // PerimeterTypes.PERIMETER_UPDATE_REQUESTED
  getPerimeterEmissions);
}

const perimeterCrudSagas = [
  fork(watchPerimeterCreationRequested),
  fork(watchPerimeterDeletionRequested),
  fork(watchPerimeterUpdateRequested),
  fork(watchPerimeterEmissionsRequested),
];

export default perimeterCrudSagas;
