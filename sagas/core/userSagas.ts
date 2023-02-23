import { put, takeEvery, call, fork, select } from "redux-saga/effects";
import { UserTypes } from "@actions/core/user/types";
import {
  ArchiveRequestedAction,
  UnarchiveRequestedAction,
  UpdateFirstNameRequestedAction,
  UpdateLastNameRequestedAction,
  CreateRequestedAction,
  setCreated,
  setCreationError,
  UpdatePerimeterRoleRequested,
} from "@actions/core/user/userActions";
import ApiClient from "@lib/wecount-api/ApiClient";
import { ApiRoutes, generateRoute } from "@lib/wecount-api/routes/apiRoutes";
import { Await } from "@lib/utils/awaitType";
import { RootState } from "@reducers/index";
import { UserWithProfileResponse } from "@lib/wecount-api/responses/apiResponses";

function* archive(action: ArchiveRequestedAction) {
  const apiClient = ApiClient.buildFromBrowser();

  const archiveCall = () =>
    apiClient.post<void>(
      generateRoute(ApiRoutes.MANAGER_USER_ARCHIVE, {
        userId: action.payload.userId,
      }),
      {}
    );
  const response: Await<ReturnType<typeof archiveCall>> = yield call(
    archiveCall
  );
}

function* unarchive(action: UnarchiveRequestedAction) {
  const apiClient = ApiClient.buildFromBrowser();

  const unarchiveCall = () =>
    apiClient.post<void>(
      generateRoute(ApiRoutes.MANAGER_USER_UNARCHIVE, {
        userId: action.payload.userId,
      }),
      {}
    );
  const response: Await<ReturnType<typeof unarchiveCall>> = yield call(
    unarchiveCall
  );
}

function* update({
  id,
  firstName,
  lastName,
}: {
  id: number;
  firstName: string;
  lastName: string;
}) {
  const apiClient = ApiClient.buildFromBrowser();

  const updateCall = () =>
    apiClient.put<void>(
      generateRoute(ApiRoutes.MANAGER_USER, {
        userId: id,
      }),
      {
        firstName,
        lastName,
      }
    );
  yield call(updateCall);
}

function* updateFirstName(action: UpdateFirstNameRequestedAction) {
  const state: RootState = yield select();
  const userList = state.core.user.userList;

  const userId = action.payload.userId;
  yield call(update, {
    id: userId,
    firstName: action.payload.newFirstName,
    lastName: userList[userId].profile.lastName,
  });
}

function* updateLastName(action: UpdateLastNameRequestedAction) {
  const state: RootState = yield select();
  const userList = state.core.user.userList;

  const userId = action.payload.userId;
  yield call(update, {
    id: userId,
    firstName: userList[userId].profile.firstName,
    lastName: action.payload.newLastName,
  });
}

function* create(action: CreateRequestedAction) {
  const apiClient = ApiClient.buildFromBrowser();

  const { email, firstName, lastName, perimeterRole, perimeterId } = action.payload;

  try {
    const createCall = () =>
      apiClient.post<UserWithProfileResponse>(
        generateRoute(ApiRoutes.PERIMETER_USERS, { id: perimeterId }),
        {
          email,
          firstName,
          lastName,
          role: perimeterRole,
        }
      );
    const response: Await<ReturnType<typeof createCall>> = yield call(createCall);

    yield put(setCreated(response.data));
  } catch (error: any) {
    yield put(setCreationError());
  }
}

function* updatePerimeterRole(action: UpdatePerimeterRoleRequested) {
  const apiClient = ApiClient.buildFromBrowser();

  const { userId, perimeterRole, perimeterId } = action.payload;
  const updateCall = () =>
    apiClient.post<UserWithProfileResponse>(
      generateRoute(ApiRoutes.USER_ROLE_WITHIN_PERIMETER, { id: perimeterId }),
      {
        userId,
        role: perimeterRole,
      }
    );
  yield call(updateCall);
}

function* watchArchiveRequested() {
  yield takeEvery(UserTypes.ARCHIVE_REQUESTED, archive);
}
function* watchUnarchiveRequested() {
  yield takeEvery(UserTypes.UNARCHIVE_REQUESTED, unarchive);
}
function* watchUpdateFirstNameRequested() {
  yield takeEvery(UserTypes.UPDATE_FIRST_NAME_REQUESTED, updateFirstName);
}
function* watchUpdateLastNameRequested() {
  yield takeEvery(UserTypes.UPDATE_LAST_NAME_REQUESTED, updateLastName);
}
function* watchUpdatePerimeterRoleRequested() {
  yield takeEvery(UserTypes.UPDATE_PERIMETER_ROLE_REQUESTED, updatePerimeterRole);
}
function* watchCreateRequested() {
  yield takeEvery(UserTypes.CREATE_REQUESTED, create);
}


const userSagas = [
  fork(watchArchiveRequested),
  fork(watchUnarchiveRequested),
  fork(watchUpdateFirstNameRequested),
  fork(watchUpdateLastNameRequested),
  fork(watchCreateRequested),
  fork(watchUpdatePerimeterRoleRequested),
];

export default userSagas;
