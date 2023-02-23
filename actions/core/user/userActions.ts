import { Dispatch } from "redux";
import ApiClient from "@lib/wecount-api/ApiClient";
import { CustomThunkAction } from "@custom-types/redux";
import { UserTypes } from "@actions/core/user/types";
import { ApiRoutes, generateRoute } from "@lib/wecount-api/routes/apiRoutes";
import {
  UserListResponse,
  UserWithProfileResponse,
} from "@lib/wecount-api/responses/apiResponses";
import { PerimeterRole } from "@custom-types/wecount-api/auth";

export type Action =
  | SetUsersAction
  | SetIsProductsFetchingAction
  | SetFetchError
  | ArchiveRequestedAction
  | UnarchiveRequestedAction
  | UpdateFirstNameRequestedAction
  | UpdateLastNameRequestedAction
  | CreateRequestedAction
  | CreatedAction
  | CreationErrorAction
  | CreationErrorRemovedAction
  | ResetUsersState
  | UpdatePerimeterRoleRequested
  | SetSearchedUsers;

export interface CreateRequestedAction {
  type: UserTypes.CREATE_REQUESTED;
  payload: {
    email: string;
    firstName: string;
    lastName: string;
    perimeterRole: PerimeterRole;
    perimeterId: number;
  };
}

interface CreatedAction {
  type: UserTypes.CREATED;
  payload: {
    user: UserWithProfileResponse;
  };
}

interface CreationErrorAction {
  type: UserTypes.CREATION_ERROR;
}

interface CreationErrorRemovedAction {
  type: UserTypes.CREATION_ERROR_REMOVED;
}

interface SetIsProductsFetchingAction {
  type: UserTypes.IS_FETCHING;
}

interface SetFetchError {
  type: UserTypes.FETCH_ERROR;
}

export interface ArchiveRequestedAction {
  type: UserTypes.ARCHIVE_REQUESTED;
  payload: {
    userId: number;
  };
}

export interface UnarchiveRequestedAction {
  type: UserTypes.UNARCHIVE_REQUESTED;
  payload: {
    userId: number;
  };
}

export interface UpdateFirstNameRequestedAction {
  type: UserTypes.UPDATE_FIRST_NAME_REQUESTED;
  payload: {
    userId: number;
    newFirstName: string;
  };
}

export interface UpdateLastNameRequestedAction {
  type: UserTypes.UPDATE_LAST_NAME_REQUESTED;
  payload: {
    userId: number;
    newLastName: string;
  };
}

interface SetUsersAction {
  type: UserTypes.SET_USERS;
  payload: {
    userList: UserListResponse;
  };
}

export interface UpdatePerimeterRoleRequested {
  type: UserTypes.UPDATE_PERIMETER_ROLE_REQUESTED;
  payload: {
    userId: number;
    perimeterId: number;
    perimeterRole: PerimeterRole;
  }
}

interface ResetUsersState {
  type: UserTypes.RESET_USERS_STATE;
}

export interface SetSearchedUsers {
  type: UserTypes.SET_SEARCHED_USERS;
  payload: {
    searchedTerms: string;
    showAll: boolean;
  }
}

export const setUsers = (perimeterId: number, customApiClient?: ApiClient): CustomThunkAction => {
  return async (dispatch: Dispatch, getState) => {
    const state = getState();
    if (state.core.user.isFetching) return;

    dispatch<SetIsProductsFetchingAction>({
      type: UserTypes.IS_FETCHING,
    });
    const apiClient = customApiClient ?? ApiClient.buildFromBrowser();
    try {
      const response = await apiClient.get<UserListResponse>(
        generateRoute(ApiRoutes.PERIMETER_USERS, { id: perimeterId })
      );
      dispatch<SetUsersAction>({
        type: UserTypes.SET_USERS,
        payload: {
          userList: response.data,
        },
      });
    } catch (error: any) {
      dispatch<SetFetchError>({
        type: UserTypes.FETCH_ERROR,
      });
      throw error;
    }
  };
};

export const requestArchive = (userId: number): ArchiveRequestedAction => ({
  type: UserTypes.ARCHIVE_REQUESTED,
  payload: {
    userId,
  },
});

export const requestUnarchive = (userId: number): UnarchiveRequestedAction => ({
  type: UserTypes.UNARCHIVE_REQUESTED,
  payload: {
    userId,
  },
});

export const requestUpdateFirstName = ({
  userId,
  newFirstName,
}: {
  userId: number;
  newFirstName: string;
}): UpdateFirstNameRequestedAction => ({
  type: UserTypes.UPDATE_FIRST_NAME_REQUESTED,
  payload: {
    userId,
    newFirstName,
  },
});

export const requestUpdateLastName = ({
  userId,
  newLastName,
}: {
  userId: number;
  newLastName: string;
}): UpdateLastNameRequestedAction => ({
  type: UserTypes.UPDATE_LAST_NAME_REQUESTED,
  payload: {
    userId,
    newLastName,
  },
});

export const requestCreation = ({
  email,
  firstName,
  lastName,
  perimeterRole,
  perimeterId,
}: {
  email: string;
  firstName: string;
  lastName: string;
  perimeterRole: PerimeterRole;
  perimeterId: number;
}): CreateRequestedAction => ({
  type: UserTypes.CREATE_REQUESTED,
  payload: {
    email,
    firstName,
    lastName,
    perimeterRole,
    perimeterId,
  },
});

export const setCreated = (user: UserWithProfileResponse): CreatedAction => ({
  type: UserTypes.CREATED,
  payload: {
    user,
  },
});

export const setCreationError = (): CreationErrorAction => ({
  type: UserTypes.CREATION_ERROR,
});

export const removeCreationError = (): CreationErrorRemovedAction => ({
  type: UserTypes.CREATION_ERROR_REMOVED,
});

export function resetUserState(): ResetUsersState {
  return {
    type: UserTypes.RESET_USERS_STATE,
  };
}

export function requestUpdatePerimeterRole({
  userId,
  perimeterId,
  perimeterRole,
}: {
  userId: number;
  perimeterId: number;
  perimeterRole: PerimeterRole;
}): UpdatePerimeterRoleRequested {
  return {
    type: UserTypes.UPDATE_PERIMETER_ROLE_REQUESTED,
    payload: {
      perimeterId,
      perimeterRole,
      userId,
    },
  };
}

export function setSearchedUsers (
  payload: SetSearchedUsers["payload"]
): CustomThunkAction {
  return async (dispatch: Dispatch, getState) => {

    dispatch<SetSearchedUsers>({
      type: UserTypes.SET_SEARCHED_USERS,
      payload
    });
  }
}
