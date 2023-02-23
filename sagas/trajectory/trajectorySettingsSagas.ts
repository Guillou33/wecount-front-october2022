import { Await } from "@lib/utils/awaitType";

import { put, call, takeLatest, fork } from "redux-saga/effects";
import ApiClient from "@lib/wecount-api/ApiClient";
import { generateRoute } from "@lib/wecount-api/routes/apiRoutes";
import { ApiRoutes } from "@lib/wecount-api/routes/apiRoutes";
import { ScopeTargetResponse } from "@lib/wecount-api/responses/apiResponses";
import { TrajectorySettingsTypes } from "@actions/trajectory/trajectorySettings/types";
import { TrajectorySettingsResponse } from "@lib/wecount-api/responses/apiResponses";
import { scopeTargetTransformer } from "@sagas/trajectory/helpers/scopeSettingsTransformer";

import {
  SaveScopeTargetRequested,
  setScopeTarget,
  LoadTrajectorySettingsRequested,
  setTrajectorySettings,
  SaveTargetYearRequested,
  setTargetYear,
} from "@actions/trajectory/trajectorySettings/trajectorySettingsActions";

function* saveScopeTarget(action: SaveScopeTargetRequested) {
  const { trajectorySettingsId, description, target, scope } = action.paylaod;

  yield put(setScopeTarget(scope, target, description));

  const apiClient = ApiClient.buildFromBrowser();

  const saveCall = () =>
    apiClient.post<ScopeTargetResponse>(
      generateRoute(ApiRoutes.TRAJECTORY_SETTINGS_SCOPE_TARGETS, {
        id: trajectorySettingsId,
        scope: scope.toLowerCase(),
      }),
      {
        description,
        target,
      }
    );

  yield call(saveCall);
}

function* watchScopeTargetSaveRequest() {
  yield takeLatest(
    TrajectorySettingsTypes.SAVE_SCOPE_TARGET_REQUESTED,
    saveScopeTarget
  );
}

function* loadTrajectorySettings(action: LoadTrajectorySettingsRequested) {
  const apiClient = ApiClient.buildFromBrowser();

  const fetchCall = () =>
    apiClient.get<TrajectorySettingsResponse>(
      generateRoute(ApiRoutes.PERIMETER_TRAJECTORY_SETTINGS, {
        id: action.payload.perimeterId,
      })
    );

  const response: Await<ReturnType<typeof fetchCall>> = yield call(fetchCall);

  yield put(setTrajectorySettings(scopeTargetTransformer(response.data)));
}

function* watchScopeTargetLoadRequest() {
  yield takeLatest(
    TrajectorySettingsTypes.LOAD_TRAJECTORY_SETTINGS_REQUESTED,
    loadTrajectorySettings
  );
}

function* saveTargetYear(action: SaveTargetYearRequested) {
  const { trajectorySettingsId, targetYear } = action.payload;
  const apiClient = ApiClient.buildFromBrowser();

  yield put(setTargetYear(targetYear));

  const updateCall = () =>
    apiClient.post(
      generateRoute(ApiRoutes.TRAJECTORY_SETTINGS_TARGET_YEAR, {
        id: trajectorySettingsId,
      }),
      {
        targetYear,
      }
    );

  yield call(updateCall);
}

function* watchTargetYearSaveRequest() {
  yield takeLatest(
    TrajectorySettingsTypes.SAVE_TRAJECTORY_TARGET_YEAR_REQUESTED,
    saveTargetYear
  );
}

const trajectorySettingsSagas = [
  fork(watchScopeTargetSaveRequest),
  fork(watchScopeTargetLoadRequest),
  fork(watchTargetYearSaveRequest),
];

export default trajectorySettingsSagas;
