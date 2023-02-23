import { put, fork, takeEvery } from "redux-saga/effects";
import { EmissionFactorChoiceTypes } from "@actions/emissionFactorChoice/types";
import { refreshEfFilters } from "@actions/emissionFactorChoice/emissionFactorChoiceActions";

function* onComputeMethodIdUpdated() {
  yield put(refreshEfFilters());
}

function* watchComputeMethodIdUpdated() {
  yield takeEvery(EmissionFactorChoiceTypes.COMPUTE_METHOD_ID_UPDATED, onComputeMethodIdUpdated);
}

const emissionFactorChoiceSagas = [
  fork(watchComputeMethodIdUpdated),
];

export default emissionFactorChoiceSagas;
