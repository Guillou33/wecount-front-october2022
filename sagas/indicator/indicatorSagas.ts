import { put, takeLeading, call, fork, takeLatest } from "redux-saga/effects";
import { Await } from "@lib/utils/awaitType";
import { IndicatorTypes } from "@actions/indicator/types";
import {
  RequestFetchCampaignIndicators,
  RequestCreateDefaultIndicators,
  RequestCreateIndicator,
  RequestUpdateIndicator,
  RequestDeleteIndicator,
  setCampaignIndicators,
  setIndicator,
} from "@actions/indicator/indicatorAction";

import { IndicatorResponse } from "@lib/wecount-api/responses/apiResponses";
import { ApiRoutes, generateRoute } from "@lib/wecount-api/routes/apiRoutes";
import ApiClient from "@lib/wecount-api/ApiClient";

function* fetchCampaignIndicators(action: RequestFetchCampaignIndicators) {
  const { campaignId } = action.payload;
  const apiClient = ApiClient.buildFromBrowser();

  const fetchIndicatorCall = () =>
    apiClient.get<IndicatorResponse[]>(
      generateRoute(ApiRoutes.INDICATORS_FOR_CAMPAIGN, { id: campaignId })
    );

  const response: Await<ReturnType<typeof fetchIndicatorCall>> = yield call(
    fetchIndicatorCall
  );

  yield put(setCampaignIndicators(campaignId, response.data));
}

function* createDefaultIndicators(action: RequestCreateDefaultIndicators) {
  const { campaignId } = action.payload;
  const apiClient = ApiClient.buildFromBrowser();

  const postDefaultIndicator = (name: string, unit: string) =>
    apiClient.post<IndicatorResponse>(generateRoute(ApiRoutes.INDICATORS), {
      campaignId,
      name,
      unit,
    });
  const createDefaultIndicatorCall = () =>
    Promise.all([
      postDefaultIndicator("tCO2 par salarié", "salariés"),
      postDefaultIndicator("tCO2 par k€ de chiffre d'affaire", "k€"),
    ]);

  const responses: Await<ReturnType<typeof createDefaultIndicatorCall>> =
    yield call(createDefaultIndicatorCall);

  const indicators = responses.map(res => res.data);

  yield put(setCampaignIndicators(campaignId, indicators));
}

function* createIndicator(action: RequestCreateIndicator) {
  const apiClient = ApiClient.buildFromBrowser();
  const { campaignId, name, unit, quantity } = action.payload;

  const createIndicatorCall = () =>
    apiClient.post<IndicatorResponse>(generateRoute(ApiRoutes.INDICATORS), {
      campaignId,
      name,
      unit,
      quantity,
    });

  const response: Await<ReturnType<typeof createIndicatorCall>> = yield call(
    createIndicatorCall
  );

  yield put(setIndicator(response.data));
}

function* updateIndicator(action: RequestUpdateIndicator) {
  const apiClient = ApiClient.buildFromBrowser();
  const { id, name, unit, quantity } = action.payload;

  const updateIndicatorCall = () =>
    apiClient.put<IndicatorResponse>(
      generateRoute(ApiRoutes.INDICATOR, { id }),
      { name, unit, quantity }
    );

  yield call(updateIndicatorCall);
}

function* deleteIndicator(action: RequestDeleteIndicator) {
  const apiClient = ApiClient.buildFromBrowser();
  const { campaignId, indicatorId } = action.payload;

  const deleteIndicatorCall = () =>
    apiClient.delete(generateRoute(ApiRoutes.INDICATOR, { id: indicatorId }));

  yield call(deleteIndicatorCall);
}

function* watchFetchCampaignIndicatorRequested() {
  yield takeLatest(
    IndicatorTypes.REQUEST_FETCH_CAMPAIGN_INDICATORS,
    fetchCampaignIndicators
  );
}

function* watchCreateDefaultIndicatorRequested() {
  yield takeLeading(
    IndicatorTypes.REQUEST_CREATE_DEFAULT_INDICATORS,
    createDefaultIndicators
  );
}

function* watchCreateIndicatorRequested() {
  yield takeLeading(IndicatorTypes.REQUEST_CREATE_INDICATOR, createIndicator);
}

function* watchUpdateIndicatorRequest() {
  yield takeLatest(IndicatorTypes.REQUEST_UPDATE_INDICATOR, updateIndicator);
}

function* watchDeleteIndicatorRequested() {
  yield takeLeading(IndicatorTypes.REQUEST_DELETE_INDICATOR, deleteIndicator);
}

const indicatorSagas = [
  fork(watchFetchCampaignIndicatorRequested),
  fork(watchCreateDefaultIndicatorRequested),
  fork(watchCreateIndicatorRequested),
  fork(watchUpdateIndicatorRequest),
  fork(watchDeleteIndicatorRequested),
];

export default indicatorSagas;
