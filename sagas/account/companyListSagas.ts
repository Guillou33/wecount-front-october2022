import { put, takeEvery, call, fork, select, takeLatest } from "redux-saga/effects";
import {
  AdminCompanyListTypes,
} from "@actions/admin/company-list/types";
import {
  loadMoreLockedCompanies,
  LoadMoreLockedRequestedAction,
  loadMoreUnlockedCompanies,
  LoadMoreUnlockedRequestedAction,
  LockRequestedAction,
  setCompanyLocked,
  setCompanyUnlocked,
  setLockedEndReached,
  setUnlockedEndReached,
  SetReadOnlyModeRequestedAction,
  FindCompaniesByName,
  setCompanies,
} from "@actions/admin/company-list/companyListActions";
import ApiClient from "@lib/wecount-api/ApiClient";
import { ApiRoutes, generateRoute } from "@lib/wecount-api/routes/apiRoutes";
import { Await } from "@lib/utils/awaitType";
import { RootState } from "@reducers/index";
import { CompanyFullResponse } from "@lib/wecount-api/responses/apiResponses";

const FETCH_BATCH_NUMBER = 20;

function* loadMore(action: LoadMoreLockedRequestedAction | LoadMoreUnlockedRequestedAction) {

  const locked = action.type === AdminCompanyListTypes.LOAD_MORE_LOCKED_REQUESTED;

  const state: RootState = yield select();

  const apiClient = ApiClient.buildFromBrowser();
  const loadMoreCompanies = () =>
    apiClient.get<CompanyFullResponse[]>(
      generateRoute(locked ? ApiRoutes.COMPANIES_LOAD_MORE_LOCKED : ApiRoutes.COMPANIES_LOAD_MORE_UNLOCKED),
      true,
      {
        params: {
          offset: Object.values(state.admin.companyList[locked ? 'locked' : 'unlocked'].companyList).length,
          length: FETCH_BATCH_NUMBER,
        },
      }
    );

  try {
    const response: Await<ReturnType<typeof loadMoreCompanies>> = yield call(
      loadMoreCompanies
    );
    const companies = response.data;

    const loadMoreAction = locked
      ? loadMoreLockedCompanies
      : loadMoreUnlockedCompanies;
    yield put(
      loadMoreAction({
        companies,
      })
    );

    if (companies.length < FETCH_BATCH_NUMBER) {
      const setEndReachedAction = locked
        ? setLockedEndReached
        : setUnlockedEndReached;
      yield put(setEndReachedAction());
    }
  } catch (err) {
    console.error("Error while fetching unlocked companies")
  }
}

function* lock(action: LockRequestedAction) {

  const apiClient = ApiClient.buildFromBrowser();
  const lockCall = () =>
    apiClient.post<void>(
      generateRoute(ApiRoutes.COMPANIES_LOCK, {
        id: action.payload.companyId
      }), {}
    );

  yield call(
    lockCall
  );
  yield put(
    setCompanyLocked({
      companyId: action.payload.companyId
    })
  );
}

function* unlock(action: LockRequestedAction) {

  const apiClient = ApiClient.buildFromBrowser();
  const unlockCall = () =>
    apiClient.post<void>(
      generateRoute(ApiRoutes.COMPANIES_UNLOCK, {
        id: action.payload.companyId
      }), {}
    );

  yield call(
    unlockCall
  );
  yield put(
    setCompanyUnlocked({
      companyId: action.payload.companyId
    })
  );
}

function* setReadOnlyMode(action: SetReadOnlyModeRequestedAction) {
  const apiClient = ApiClient.buildFromBrowser();
  const setReadOnlyModeCall = () =>
    apiClient.put<CompanyFullResponse>(
      generateRoute(ApiRoutes.COMPANIES_SET_READ_ONLY_MODE, {
        id: action.payload.companyId,
      }),
      { readonlyMode: action.payload.readonlyMode }
    );

  yield call(setReadOnlyModeCall);
}

function* findCompaniesByName(action:FindCompaniesByName) {
  const apiClient = ApiClient.buildFromBrowser();
  const { name, locked } = action.payload;
  const route = locked
    ? ApiRoutes.COMPANIES_SEARCH_LOCKED
    : ApiRoutes.COMPANIES_SEARCH_UNLOCKED;

  const findCompanies = () =>
    apiClient.get<CompanyFullResponse[]>(
      generateRoute(route),
      true,
      {
        params: {
          name,
        },
      }
    );

    try {
      const response: Await<ReturnType<typeof findCompanies>> = yield call(
        findCompanies
      );
      const companies = response.data;
      yield put(setCompanies({ companies, locked }));
    } catch (error) {
      console.error("Error while searching for companies", error);
    }
}


function* watchLoadMoreLockedRequested() {
  yield takeLatest(AdminCompanyListTypes.LOAD_MORE_LOCKED_REQUESTED, loadMore);
}
function* watchLoadMoreUnlockedRequested() {
  yield takeLatest(AdminCompanyListTypes.LOAD_MORE_UNLOCKED_REQUESTED, loadMore);
}
function* watchLockRequested() {
  yield takeEvery(AdminCompanyListTypes.LOCK_REQUESTED, lock);
}
function* watchUnlockRequested() {
  yield takeEvery(AdminCompanyListTypes.UNLOCK_REQUESTED, unlock);
}
function* watchSetReadOnlyModeRequested() {
  yield takeLatest(AdminCompanyListTypes.SET_READ_ONLY_MODE_REQUESTED, setReadOnlyMode);
}
function* watchFindCompaniesByNameRequested() {
  yield takeLatest(AdminCompanyListTypes.FIND_COMPANIES_BY_NAME, findCompaniesByName)
}

const companyListSagas = [
  fork(watchLoadMoreLockedRequested),
  fork(watchLoadMoreUnlockedRequested),
  fork(watchLockRequested),
  fork(watchUnlockRequested),
  fork(watchSetReadOnlyModeRequested),
  fork(watchFindCompaniesByNameRequested),
];

export default companyListSagas;
