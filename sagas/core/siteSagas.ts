import { put, takeEvery, call, fork, select, takeLeading } from "redux-saga/effects";
import { SiteTypes } from "@actions/core/site/types";
import {
  ArchiveRequestedAction,
  UnarchiveRequestedAction,
  UpdateDescriptionRequestedAction,
  UpdateNameRequestedAction,
  CreateRequestedAction,
  setCreated,
  setCreationError,
  UpdateParentSiteRequestedAction,
  MultipleArchiveRequested,
} from "@actions/core/site/siteActions";
import ApiClient from "@lib/wecount-api/ApiClient";
import { ApiRoutes, generateRoute } from "@lib/wecount-api/routes/apiRoutes";
import { Await } from "@lib/utils/awaitType";
import { RootState } from "@reducers/index";
import { SiteResponse } from "@lib/wecount-api/responses/apiResponses";
import { getSubSite } from "./helpers/getSubSite";

function* archive(action: ArchiveRequestedAction) {
  const apiClient = ApiClient.buildFromBrowser();

  const archiveCall = () =>
    apiClient.post<void>(
      generateRoute(ApiRoutes.ARCHIVE_SITE, {
        siteId: action.payload.siteId,
      }),
      {
        parentSiteId: action.payload.parentSiteId
      }
    );
  const response: Await<ReturnType<typeof archiveCall>> = yield call(
    archiveCall
  );
}

function* archiveMultiple(action: MultipleArchiveRequested) {
  const apiClient = ApiClient.buildFromBrowser();

  const archiveCall = () =>
    apiClient.post<void>(
      generateRoute(ApiRoutes.ARCHIVE_MULTIPLE_SITES, {}),
      {
        listIds: action.payload.listIds
      }
    );
  console.log("listIds => ", action.payload.listIds)
  const response: Await<ReturnType<typeof archiveCall>> = yield call(
    archiveCall
  );
}

function* unarchive(action: UnarchiveRequestedAction) {
  const apiClient = ApiClient.buildFromBrowser();

  const unarchiveCall = () =>
    apiClient.post<void>(
      generateRoute(ApiRoutes.UNARCHIVE_SITE, {
        siteId: action.payload.siteId,
      }),
      {
        parentSiteId: action.payload.parentSiteId
      }
    );
  const response: Await<ReturnType<typeof unarchiveCall>> = yield call(
    unarchiveCall
  );
}

function* update({
  id,
  name,
  description,
  parentSiteId
}: {
  id: number;
  name: string;
  description: string | null;
  parentSiteId: number | null;
}) {
  const apiClient = ApiClient.buildFromBrowser();

  const updateCall = () =>
    apiClient.put<void>(
      generateRoute(ApiRoutes.SITE, {
        siteId: id,
      }),
      {
        name,
        description,
        parentSiteId
      }
    );
  yield call(updateCall);
}

function* updateName(action: UpdateNameRequestedAction) {
  const state: RootState = yield select();
  const siteList = state.core.site.siteList;

  const siteId = action.payload.siteId;

  const site = siteList[siteId] !== undefined ?
    siteList[siteId] :
    getSubSite(siteList, siteId);

  yield call(update, {
    id: siteId,
    name: action.payload.newName,
    description: site.description,
    parentSiteId: siteList[siteId] !== undefined ? null : getSubSite(siteList, siteId).parentSiteId
  });
}

function* updateDescription(action: UpdateDescriptionRequestedAction) {
  const state: RootState = yield select();
  const siteList = state.core.site.siteList;

  const siteId = action.payload.siteId;

  yield call(update, {
    id: siteId,
    name: siteList[siteId].name,
    description: action.payload.newDescription,
    parentSiteId: siteList[siteId] !== undefined ? null : getSubSite(siteList, siteId).parentSiteId
  });
}

function* updateParentSite(action: UpdateParentSiteRequestedAction) {
  const state: RootState = yield select();
  const siteList = state.core.site.siteList;

  const siteId = action.payload.siteId;

  const site = siteList[siteId] !== undefined ?
    siteList[siteId] :
    getSubSite(siteList, siteId);

  yield call(update, {
    id: siteId,
    name: site.name,
    description: site.description,
    parentSiteId: action.payload.newParentSiteId ? action.payload.newParentSiteId : null
  });

}

function* create(action: CreateRequestedAction) {
  const apiClient = ApiClient.buildFromBrowser();

  const { name, description, perimeterId, parentSiteId } = action.payload;

  try {
    const createCall = () =>
      apiClient.post<SiteResponse>(ApiRoutes.SITES,
        {
          perimeterId,
          name,
          description,
          parentSiteId
        }
      );
    const response: Await<ReturnType<typeof createCall>> = yield call(createCall);
    yield put(setCreated({
      site: response.data,
      parentSiteId: parentSiteId
    }));
  } catch (error: any) {
    yield put(setCreationError());
  }
}

function* watchArchiveRequested() {
  yield takeEvery(SiteTypes.ARCHIVE_REQUESTED, archive);
}
function* watchMultipleArchiveRequested() {
  yield takeEvery(SiteTypes.MULTIPLE_ARCHIVE_REQUESTED, archiveMultiple);
}
function* watchUnarchiveRequested() {
  yield takeEvery(SiteTypes.UNARCHIVE_REQUESTED, unarchive);
}
function* watchUpdateNameRequested() {
  yield takeEvery(SiteTypes.UPDATE_NAME_REQUESTED, updateName);
}
function* watchUpdateDescriptionRequested() {
  yield takeEvery(SiteTypes.UPDATE_DESCRIPTION_REQUESTED, updateDescription);
}
function* watchUpdateParentSiteRequested() {
  yield takeEvery(SiteTypes.UPDATE_PARENT_SITE_REQUESTED, updateParentSite);
}
function* watchCreateRequested() {
  yield takeEvery(SiteTypes.CREATE_REQUESTED, create);
}

const siteSagas = [
  fork(watchArchiveRequested),
  fork(watchMultipleArchiveRequested),
  fork(watchUnarchiveRequested),
  fork(watchUpdateNameRequested),
  fork(watchUpdateDescriptionRequested),
  fork(watchUpdateParentSiteRequested),
  fork(watchCreateRequested),
];

export default siteSagas;
