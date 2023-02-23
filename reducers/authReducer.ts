import {
  AuthTypes,
} from "@actions/auth/types";
import { Action } from "@actions/auth/authActions";
import { Role } from '@custom-types/wecount-api/auth';

interface LoginErrors {
  emailError: boolean;
  passwordError: boolean;
  badCredentialsError: boolean;
  tooManyPasswordErrors: boolean;
  genericError: boolean;
}

export interface AuthState {
  email: string | undefined;
  roles: Role[];
  loginErrors: LoginErrors;
  id: number | undefined;
}

/**
 * Initial reducer state
 * @type {Object}
 */
const INITIAL_STATE: AuthState = {
  email: undefined,
  id: undefined,
  roles: [Role.ROLE_ANONYMOUS],
  loginErrors: {
    emailError: false,
    passwordError: false,
    badCredentialsError: false,
    tooManyPasswordErrors: false,
    genericError: false,
  },
};

/**
 * Updates reducer state depending on action type
 * @param {Object} state - the reducer state
 * @param {Object} action - the fired action object
 * @param {string} action.type - the action type
 * @param {?Object} action.payload - additional action data
 * @return {Object} new reducer state
 */

const reducer = (state: AuthState = INITIAL_STATE, action: Action) => {
  switch (action.type) {
    case AuthTypes.LOGIN_SUCCESS:
      return {
        ...state,
        email: action.payload.email,
        roles: action.payload.roles,
        id: action.payload.id,
      };
    case AuthTypes.AUTH_INFO:
      return {
        ...state,
        email: action.payload.email,
        roles: action.payload.roles,
        id: action.payload.id,
      };
    case AuthTypes.LOGIN_EMAIL_ERROR:
      return { ...state, loginErrors: { ...state.loginErrors, emailError: true } };
    case AuthTypes.LOGIN_PASSWORD_ERROR:
      return { ...state, loginErrors: { ...state.loginErrors, passwordError: true } };
    case AuthTypes.LOGIN_BAD_CREDENTIALS_ERROR:
      return { ...state, loginErrors: { ...state.loginErrors, badCredentialsError: true } };
    case AuthTypes.TOO_MANY_PASSWORD_ERRORS:
      return { ...state, loginErrors: { ...state.loginErrors, tooManyPasswordErrors: true } };
    case AuthTypes.LOGIN_GENERIC_ERROR:
      return { ...state, loginErrors: { ...state.loginErrors, genericError: true } };
    case AuthTypes.LOGIN_RESET_ERRORS:
      return { ...state, loginErrors: { ...INITIAL_STATE.loginErrors } };
    default:
      return state;
  }
};

export default reducer;
