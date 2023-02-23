import { put, takeLatest, fork } from "redux-saga/effects";
import { SwitchCurrentPerimeterRequested } from "@actions/perimeter/perimeterActions";
import { PerimeterTypes } from "@actions/perimeter/types";

import { setCurrentPerimeter } from "@actions/perimeter/perimeterActions";
import { resetCampaignState } from "@actions/campaign/campaignActions";
import { resetSitesState } from "@actions/core/site/siteActions";
import { resetProductsState } from "@actions/core/product/productActions";
import { resetCategoriesPreferencesState } from "@actions/userPreference/activityCategories/activityCategoriesAction";
import { resetVisibleActivityModelsState } from "@actions/userPreference/activityModels/activityModelsActions";
import { resetTrajectorySettingsState } from "@actions/trajectory/trajectorySettings/trajectorySettingsActions";
import { resetUserState } from "@actions/core/user/userActions";
import { resetAllFilters } from "@actions/filters/filtersAction";
import { resetCampaignEntries } from "@actions/entries/campaignEntriesAction";
import { resetEntryTagState } from "@actions/core/entryTag/entryTagActions";
import { resetCustomEmissionFactorState } from "@actions/core/customEmissionFactor/customEmissionFactorActions";

function* switchPerimeter(action: SwitchCurrentPerimeterRequested) {
  const perimeterId = action.payload;

  yield put(setCurrentPerimeter(perimeterId));

  yield put(resetCampaignState());
  yield put(resetCustomEmissionFactorState());
  yield put(resetSitesState());
  yield put(resetProductsState());
  yield put(resetCategoriesPreferencesState());
  yield put(resetVisibleActivityModelsState());
  yield put(resetTrajectorySettingsState());
  yield put(resetUserState());
  yield put(resetAllFilters());
  yield put(resetEntryTagState());
  yield put(resetCampaignEntries());
}

function* watchSwitchPerimeterRequests() {
  yield takeLatest(
    PerimeterTypes.SWITCH_CURRENT_PERIMETER_REQUESTED,
    switchPerimeter
  );
}

const switchPerimeterSagas = [fork(watchSwitchPerimeterRequests)];

export default switchPerimeterSagas;
