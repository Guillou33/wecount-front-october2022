import { toggleCard } from "@actions/cardExpansion/cardExpansionActions";
import { addEntry, DuplicateEntryRequested } from "@actions/entries/campaignEntriesAction";
import { CampaignEntriesTypes } from "@actions/entries/campaignEntriesTypes";
import { Await } from "@lib/utils/awaitType";
import ApiClient from "@lib/wecount-api/ApiClient";
import { ActivityEntryFullResponse } from "@lib/wecount-api/responses/apiResponses";
import { ApiRoutes, generateRoute } from "@lib/wecount-api/routes/apiRoutes";
import { call, put, takeLatest } from "redux-saga/effects";

import { formatEntryResponse } from "./helpers/formatEntryResponse";

function* duplicateEntrySaga(action: DuplicateEntryRequested) {
    const {
        cardExpansionName,
        activityEntryId,
        computeMethodId,
        campaignId
    } = action.payload;

    const apiClient = ApiClient.buildFromBrowser();

    const duplicateEntryCall = () => {
        return apiClient.post<ActivityEntryFullResponse>(
            generateRoute(ApiRoutes.ACTIVITY_ENTRY_DUPLICATE, {
                campaignId: campaignId,
                activityEntryId: activityEntryId!,
            }),
            {
                computeMethodId: computeMethodId,
            }
        );
    }
    const response: Await<ReturnType<typeof duplicateEntryCall>> = yield call(
        duplicateEntryCall
    );
    
    yield put(
        addEntry({ campaignId, entry: formatEntryResponse(response.data)})
    );

    const newEntryKey = response.data.id.toString();
    yield put(
        toggleCard({
            cardExpansionName,
            cardId: newEntryKey
        })
    )
}

export function* watchDuplicateEntryRequests() {
    yield takeLatest(
        CampaignEntriesTypes.DUPLICATE_ENTRY,
        duplicateEntrySaga
    );
}
