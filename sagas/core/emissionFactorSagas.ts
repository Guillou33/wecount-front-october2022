import { fillAutocompleteEmissionFactors, RequestAutocompleteAction } from "@actions/core/emissionFactor/emissionFactorActions";
import { EmissionFactorTypes } from "@actions/core/emissionFactor/types";
import { removeNotEnoughCharchtersEfSearchError, setNotEnoughCharchtersEfSearchError, startSearching, stopSearching } from "@actions/emissionFactorChoice/emissionFactorChoiceActions";
import { Await } from "@lib/utils/awaitType";
import ApiClient from "@lib/wecount-api/ApiClient";
import { EmissionFactorMappingResponse } from "@lib/wecount-api/responses/apiResponses";
import { ApiRoutes, generateRoute } from "@lib/wecount-api/routes/apiRoutes";
import { call, fork, put, takeLatest } from "redux-saga/effects";

const waitInms = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function* autocompleteEmissionFactors(action: RequestAutocompleteAction) {
  yield put(removeNotEnoughCharchtersEfSearchError());
  const {
    activityModelId,
    computeMethodId,
    searchText,
  } = action.payload;

  const apiClient = ApiClient.buildFromBrowser();
  const autocompleteCall = () =>
    apiClient.get<EmissionFactorMappingResponse[]>(
      generateRoute(ApiRoutes.AUTOCOMPLETE_EMISSION_FACTORS, {
        computeMethodId,
      }),
      true,
      {
        params: {
          search: searchText,
        },
      }
    );

  // Wait a bit before spinner, and still a bit after (to prevent useless calls)
  yield call(() => waitInms(300));
  yield put(
    fillAutocompleteEmissionFactors({
      activityModelId,
      computeMethodId,
      emissionFactorMappings: [],
    })
  );
  if (searchText.length < 3) {
    yield call(() => waitInms(700));
    yield put(setNotEnoughCharchtersEfSearchError());
    yield put(stopSearching());
    
    return;
  }

  yield put(startSearching());
  yield call(() => waitInms(300));

  try {
    const response: Await<ReturnType<typeof autocompleteCall>> = yield call(
      autocompleteCall
    );
  
    yield put(
      fillAutocompleteEmissionFactors({
        activityModelId,
        computeMethodId,
        emissionFactorMappings: response.data,
      })
    );
  } catch (e: any) {}
  yield put(stopSearching());
}

function* watchAutocompleteRequested() {
  yield takeLatest(
    EmissionFactorTypes.AUTOCOMPLETE_REQUESTED,
    autocompleteEmissionFactors
  );
}

const emissionFactorSagas = [fork(watchAutocompleteRequested)];

export default emissionFactorSagas;
