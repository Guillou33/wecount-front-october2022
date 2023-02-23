import { ToggleSearchableFilterPresence } from "@actions/filters/filtersAction";
import { FiltersActionType } from "@actions/filters/types";
import { analyticEvents, EventType } from "@custom-types/core/AnalyticEvents";
import { Await } from "@lib/utils/awaitType";
import ApiClient from "@lib/wecount-api/ApiClient";
import { Analytics } from "@lib/wecount-api/responses/apiResponses";
import { ApiRoutes, generateRoute } from "@lib/wecount-api/routes/apiRoutes";
import { getCurrentCampaign } from "@selectors/campaign/selectCurrentCampaign";

import { call, select, takeLeading } from "redux-saga/effects";

function* submitSearchableItemsFilterEvent(action: ToggleSearchableFilterPresence) {
    const { filterName, elementId } = action.payload;

    const {
        campaign
    } = yield select(getCurrentCampaign);

    const apiClient = ApiClient.buildFromBrowser();

    const sendFilterAnalyticCall = () =>
        apiClient.post<Analytics>(
            generateRoute(ApiRoutes.ANALYTICS),
            {
                eventName: analyticEvents[EventType.FILTERS][filterName],
                campaignId: campaign.currentCampaign
            }
        );

    const response: Await<ReturnType<typeof sendFilterAnalyticCall>> = yield call(
        sendFilterAnalyticCall
    );
}


export function* watchFilterSearchableItems() {
    yield takeLeading(
        FiltersActionType.TOGGLE_SEARCHABLE_FILTER_PRESENCE,
        submitSearchableItemsFilterEvent
    );
}
