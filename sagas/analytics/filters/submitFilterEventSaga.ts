import { fork, select } from "redux-saga/effects";
import { watchFilterExcluded } from "./submitExcludedFilter";
import { watchFilterSearchableItems } from "./submitSearchableItemsFilter";
import { watchFilterSitesProducts } from "./submitSitesProductsFilter";
import { watchFilterStatus } from "./submitStatusFilter";
import { watchFilterUserData } from "./submitUserDataFilter";

export const submitFilterEventSaga = [
    fork(watchFilterExcluded),
    fork(watchFilterSitesProducts),
    fork(watchFilterStatus),
    fork(watchFilterSearchableItems),
    fork(watchFilterUserData)
];