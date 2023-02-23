import { PushView } from "@actions/chartNavigation/chartNavigationActions";
import { ChartNavigationTypes } from "@actions/chartNavigation/types";
import { analyticEvents, EventType, GraphicEventType } from "@custom-types/core/AnalyticEvents";
import { Await } from "@lib/utils/awaitType";
import ApiClient from "@lib/wecount-api/ApiClient";
import { Analytics } from "@lib/wecount-api/responses/apiResponses";
import { ApiRoutes, generateRoute } from "@lib/wecount-api/routes/apiRoutes";
import { getCurrentCampaign } from "@selectors/campaign/selectCurrentCampaign";

import { call, put, select, takeLeading } from "redux-saga/effects";

function* submitPushView(action: PushView) {
    const { view } = action.payload;

    const {
        campaign
    } = yield select(getCurrentCampaign);

    const apiClient = ApiClient.buildFromBrowser();

    const sendGraphicsAnalyticCall = () =>
        apiClient.post<Analytics>(
            generateRoute(ApiRoutes.ANALYTICS),
            {
                eventName: `${analyticEvents[EventType.GRAPHICS][GraphicEventType.PUSH_VIEW]}_${view.toLowerCase()}`,
                campaignId: campaign.currentCampaign
            }
        );

    const response: Await<ReturnType<typeof sendGraphicsAnalyticCall>> = yield call(
        sendGraphicsAnalyticCall
    );
}

export function* watchPushView() {
    yield takeLeading(
        ChartNavigationTypes.PUSH_VIEW,
        submitPushView
    );
}
