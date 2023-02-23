import { put, call, fork, takeLatest, select } from "redux-saga/effects";
import ApiClient from "@lib/wecount-api/ApiClient";
import { ApiRoutes, generateRoute } from "@lib/wecount-api/routes/apiRoutes";
import { Await } from "@lib/utils/awaitType";
import { AccountTypes } from "@actions/account/types";
import { RequestChangeLanguageAction } from "@actions/account/accountActions";
import { convertLanguageToLocale } from "@lib/translation/config/Locale";
import { getCurrentCampaign } from "@selectors/campaign/selectCurrentCampaign";

function* changeLanguage(action: RequestChangeLanguageAction) {
  const apiClient = ApiClient.buildFromBrowser();
  const { language } = action.payload;

  const {
    campaign
  } = yield select(getCurrentCampaign);

  const campaignId = campaign.currentCampaign;

  const changeLanguageCall = () =>
    apiClient.put<void>(
      generateRoute(ApiRoutes.ACCOUNT_CHANGE_LOCALE),
      {
        locale: convertLanguageToLocale(language),
      }
    );

  try {
    const response: Await<ReturnType<typeof changeLanguageCall>> = yield call(
      changeLanguageCall
    );
    try {
      yield call(() => apiClient.refresh())
    } catch (error) {}
    location.assign(campaignId === undefined ? '/account/language' : `/campaigns/${campaignId}`);
  } catch (err) {
    console.error("Error while changing language")
  }
}

function* watchChangeLanguageRequested() {
  yield takeLatest(AccountTypes.ACCOUNT_CHANGE_LANGUAGE_REQUESTED, changeLanguage)
}

const languageSagas = [
  fork(watchChangeLanguageRequested),
];

export default languageSagas;
