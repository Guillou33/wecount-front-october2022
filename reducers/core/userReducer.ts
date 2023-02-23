import { UserTypes } from "@actions/core/user/types";
import { Action } from "@actions/core/user/userActions";
import { UserListResponse, UserWithProfileResponse } from "@lib/wecount-api/responses/apiResponses";
import immer from 'immer';

export interface User extends UserWithProfileResponse {

}

export type UserList = { [userId: number]: User };

interface UserState {
  userList: UserList;
  isFetched: boolean;
  isFetching: boolean;
  isCreating: boolean;
  creationError: boolean;
  searchedTerms: string;
}

/**
 * Initial reducer state
 * @type {Object}
 */
const INITIAL_STATE: UserState = {
  userList: {},
  isFetched: false,
  isFetching: false,
  isCreating: false,
  creationError: false,
  searchedTerms: ""
};

/**
 * Updates reducer state depending on action type
 * @param {Object} state - the reducer state
 * @param {Object} action - the fired action object
 * @param {string} action.type - the action type
 * @param {?Object} action.payload - additional action data
 * @return {Object} new reducer state
 */

const reducer = (
  state: UserState = INITIAL_STATE,
  action: Action
): UserState => {
  switch (action.type) {
    case UserTypes.IS_FETCHING:
      return {
        ...state, 
        isFetching: true,
      };
    case UserTypes.FETCH_ERROR:
      return {
        ...state, 
        isFetching: false,
      };
    case UserTypes.SET_USERS:
      return {
        ...state, 
        userList: formatFromServer(action.payload.userList),
        isFetched: true,
      };
    case UserTypes.ARCHIVE_REQUESTED:
      return immer(state, draftState => {
        draftState.userList[action.payload.userId]!.archived = true;
      });
    case UserTypes.UNARCHIVE_REQUESTED:
      return immer(state, draftState => {
        draftState.userList[action.payload.userId]!.archived = false;
      });
    case UserTypes.UPDATE_FIRST_NAME_REQUESTED:
      return immer(state, draftState => {
        draftState.userList[action.payload.userId]!.profile.firstName = action.payload.newFirstName;
      });
    case UserTypes.UPDATE_LAST_NAME_REQUESTED:
      return immer(state, draftState => {
        draftState.userList[action.payload.userId]!.profile.lastName = action.payload.newLastName;
      });
    case UserTypes.UPDATE_PERIMETER_ROLE_REQUESTED:
      return immer(state, draftState => {
        draftState.userList[action.payload.userId].roleWithinPerimeter = action.payload.perimeterRole;
      })
    case UserTypes.CREATED:
      return immer(state, draftState => {
        draftState.userList[action.payload.user.id] = action.payload.user;
        draftState.isCreating = false;
      });
    case UserTypes.CREATE_REQUESTED:
      return immer(state, draftState => {
        draftState.isCreating = true;
        draftState.creationError = false;
      });
    case UserTypes.CREATION_ERROR:
      return immer(state, draftState => {
        draftState.isCreating = false;
        draftState.creationError = true;
      });
    case UserTypes.CREATION_ERROR_REMOVED:
      return immer(state, draftState => {
        draftState.creationError = false;
      });
    case UserTypes.RESET_USERS_STATE: {
      return INITIAL_STATE;
    }
    case UserTypes.SET_SEARCHED_USERS: 
      return {
        ...state,
        searchedTerms: action.payload.searchedTerms
      }
    default:
      return state;
  }
};

const formatFromServer = (userListFromServer: UserListResponse): UserList => {
  return userListFromServer.reduce((userList: UserList, user) => {
    userList[user.id] = {...user};
    return userList;
  }, {});
};

export default reducer;
