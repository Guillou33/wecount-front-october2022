import { put, takeLatest, takeEvery, call, fork } from "redux-saga/effects";
import {
  EntryTagCreationRequested,
  UpdateRequested,
  ArchiveRequested,
  UnarchiveRequested,
  setEntryTagCreated,
  setCreationError,
} from "@actions/core/entryTag/entryTagActions";
import { EntryTagTypes } from "@actions/core/entryTag/types";
import { EntryTagResponse } from "@lib/wecount-api/responses/apiResponses";

import ApiClient from "@lib/wecount-api/ApiClient";
import { ApiRoutes, generateRoute } from "@lib/wecount-api/routes/apiRoutes";
import { Await } from "@lib/utils/awaitType";

function* createEntryTag(action: EntryTagCreationRequested) {
  const apiClient = ApiClient.buildFromBrowser();

  const { name, perimeterId } = action.payload;
  const createCall = () =>
    apiClient.post<EntryTagResponse>(generateRoute(ApiRoutes.ENTRY_TAGS), {
      name,
      perimeterId,
    });

  try {
    const response: Await<ReturnType<typeof createCall>> = yield call(
      createCall
    );

    yield put(setEntryTagCreated({ entryTag: response.data }));
  } catch (err) {
    yield put(setCreationError());
  }
}

function* updateEntryTag(action: UpdateRequested) {
  const apiClient = ApiClient.buildFromBrowser();

  const { entryTagId, newName } = action.payload;
  const updateCall = () =>
    apiClient.put<void>(
      generateRoute(ApiRoutes.ENTRY_TAG, { id: entryTagId }),
      { name: newName }
    );

  yield call(updateCall);
}

function* archiveEntryTag(action: ArchiveRequested) {
  const apiClient = ApiClient.buildFromBrowser();

  const { entryTagId } = action.payload;
  const archiveCall = () =>
    apiClient.post<void>(
      generateRoute(ApiRoutes.ARCHIVE_ENTRY_TAG, { id: entryTagId }),
      {}
    );

  yield call(archiveCall);
}

function* unarchiveEntryTag(action: UnarchiveRequested) {
  const apiClient = ApiClient.buildFromBrowser();

  const { entryTagId } = action.payload;
  const unarchiveCall = () =>
    apiClient.post<void>(
      generateRoute(ApiRoutes.UNARCHIVE_ENTRY_TAG, { id: entryTagId }),
      {}
    );

  yield call(unarchiveCall);
}

function* watchEntryTagsCreationRequested() {
  yield takeEvery(EntryTagTypes.CREATE_REQUESTED, createEntryTag);
}

function* watchEntryTagsUpdateRequested() {
  yield takeLatest(EntryTagTypes.UPDATE_REQUESTED, updateEntryTag);
}

function* watchEntryTagsArchiveRequested() {
  yield takeLatest(EntryTagTypes.ARCHIVE_REQUESTED, archiveEntryTag);
}

function* watchEntryTagsUnarchiveRequested() {
  yield takeLatest(EntryTagTypes.UNARCHIVE_REQUESTED, unarchiveEntryTag);
}

const entryTagSagas = [
  fork(watchEntryTagsCreationRequested),
  fork(watchEntryTagsUpdateRequested),
  fork(watchEntryTagsArchiveRequested),
  fork(watchEntryTagsUnarchiveRequested),
];

export default entryTagSagas;
