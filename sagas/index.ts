import { all } from "redux-saga/effects";

import coreSagas from "@sagas/core/index";
import adminSagas from "@sagas/admin/index";
import trajectorySagas from "@sagas/trajectory/index";
import indicatorSagas from "@sagas/indicator/index";
import activityCategoriesSagas from "@sagas/userPreferences/activityCategoriesPreferencesSagas";
import perimeterSagas from "@sagas/perimeter";
import activityEntrySaga from "@sagas/activityEntry";
import reglementationTablesSagas from "@sagas/reglementationTables";
import analyticsSagas from "./analytics";
import accountSagas from "./account";
import entryDataSagas from "@sagas/dataImport/entryDataSagas";
import emissionFactorChoiceSagas from "@sagas/emissionFactorChoice";
import sitesDataSagas from "./dataImport/sitesDataSagas";

export default function* appSaga() {
  yield all([
    ...coreSagas,
    ...adminSagas,
    ...trajectorySagas,
    ...indicatorSagas,
    ...activityCategoriesSagas,
    ...perimeterSagas,
    ...activityEntrySaga,
    ...reglementationTablesSagas,
    ...analyticsSagas,
    ...accountSagas,
    ...entryDataSagas,
    ...sitesDataSagas,
    ...emissionFactorChoiceSagas,
  ]);
}
