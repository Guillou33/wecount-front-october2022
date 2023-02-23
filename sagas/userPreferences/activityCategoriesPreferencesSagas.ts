import { put, call, fork, takeLatest } from "redux-saga/effects";

import { ActivityCategoriesPreferencesType } from "@actions/userPreference/activityCategories/types";
import {
  setAllActivityCategoriesPreferences,
  ActivityCategoriesPreferencesRequested,
  UpdateDescription,
  SaveOrders,
} from "@actions/userPreference/activityCategories/activityCategoriesAction";

import ApiClient from "@lib/wecount-api/ApiClient";
import { ApiRoutes, generateRoute } from "@lib/wecount-api/routes/apiRoutes";
import { Await } from "@lib/utils/awaitType";
import { CartographySettingsResponse } from "@lib/wecount-api/responses/apiResponses";

function* fetchActivityCategoriesPreferences(
  action: ActivityCategoriesPreferencesRequested
) {
  const apiClient = ApiClient.buildFromBrowser();

  const fetchActivityCategoryPreferencesCall = () =>
    apiClient.get<CartographySettingsResponse>(
      generateRoute(ApiRoutes.PERIMETERS_CARTOGRAPHY_SETTINGS, {
        id: action.payload,
      })
    );

  const response: Await<
    ReturnType<typeof fetchActivityCategoryPreferencesCall>
  > = yield call(fetchActivityCategoryPreferencesCall);

  yield put(
    setAllActivityCategoriesPreferences(response.data.categorySettings)
  );
}

function* watchActivityCategoriesRequested() {
  yield takeLatest(
    ActivityCategoriesPreferencesType.ACTIVITY_CATEGORIES_PREFERENCES_REQUESTED,
    fetchActivityCategoriesPreferences
  );
}

function* updateActivityCategoryDescription(action: UpdateDescription) {
  const apiClient = ApiClient.buildFromBrowser();
  const { perimeterId, ...categorySetting } = action.payload;

  const updateActivityCategoryDescriptionCall = () =>
    apiClient.post<void>(
      generateRoute(ApiRoutes.USER_PREFERENCE_ACTIVITY_CATEGORIES),
      {
        perimeterId,
        categorySettings: [categorySetting]
      }
    );

  yield call(updateActivityCategoryDescriptionCall);
}

function* saveActivityCategoriesOrders(action: SaveOrders) {
  const apiClient = ApiClient.buildFromBrowser();

  const updateActivityCategoryDescriptionCall = () =>
    apiClient.post<void>(
      generateRoute(ApiRoutes.USER_PREFERENCE_ACTIVITY_CATEGORIES),
      action.payload
    );

  yield call(updateActivityCategoryDescriptionCall);
}

function* watchUpdateDescriptionRequested() {
  yield takeLatest(
    ActivityCategoriesPreferencesType.ACTIVITY_CATEGORY_PREFERENCE_UPDATE_DESCRIPTION,
    updateActivityCategoryDescription
  );
}

function* watchSaveOrdersRequested() {
  yield takeLatest(
    ActivityCategoriesPreferencesType.ACTIVITY_CATEGORY_PREFERENCE_SAVE_ORDERS,
    saveActivityCategoriesOrders
  );
}

const activityCategoriesPreferencesSagas = [
  fork(watchActivityCategoriesRequested),
  fork(watchUpdateDescriptionRequested),
  fork(watchSaveOrdersRequested),
];

export default activityCategoriesPreferencesSagas;
