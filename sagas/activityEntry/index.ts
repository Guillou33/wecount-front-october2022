import { fork } from "redux-saga/effects";
import { watchFetchRequests, watchFetchEntriesOfCampaignsRequests } from "./fetchAllEntriesSaga";
import { watchUpdateEntryRequests } from "./updateEntrySaga";
import { watchDeleteRequests } from "./deleteEntrySaga";
import { watchDuplicateEntryRequests } from "./duplicateEntrySaga";
import { watchEntrySubmissions } from "./submitEntryForValidation";
import { watchHistoryFetchRequests } from "./fetchHistorySaga";
import { watchUpdateEntriesStatus } from "./list/updateEntriesStatus";
import { watchDeleteEntriesRequests } from "./list/deleteEntries";

const activityEntrySagas = [
  fork(watchFetchRequests),
  fork(watchUpdateEntryRequests),
  fork(watchDeleteRequests),
  fork(watchDuplicateEntryRequests),
  fork(watchEntrySubmissions),
  fork(watchHistoryFetchRequests),
  fork(watchUpdateEntriesStatus),
  fork(watchDeleteEntriesRequests),
  fork(watchFetchEntriesOfCampaignsRequests),
];

export default activityEntrySagas;
