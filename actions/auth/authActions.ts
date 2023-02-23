import { Dispatch } from "redux";
import ApiClient from "@lib/wecount-api/ApiClient";
import { CustomThunkAction } from "@custom-types/redux";
import BrowserAuthTokenManager from "@lib/wecount-api/BrowserAuthTokenManager";
import { ServerError } from "@custom-types/wecount-api/errors";
import { Role } from "@custom-types/wecount-api/auth";
import { AuthTypes } from "@actions/auth/types";
import { UnauthenticatedError } from "@errors/auth/UnauthenticatedError";
import { ApiRoutes, generateRoute } from '@lib/wecount-api/routes/apiRoutes';
import jwt from "jsonwebtoken";
import { Analytics } from "@lib/wecount-api/responses/apiResponses";
import { analyticEvents, EventType, UserEventType } from "@custom-types/core/AnalyticEvents";
import { LOCALE } from "@lib/translation/config/Locale";

export type Action =
  | LoginSuccessAction
  | LoginEmailErrorAction
  | LoginPasswordErrorAction
  | LoginResetErrorsAction
  | LoginBadCredentialsErrorAction
  | LoginGenericErrorAction
  | SetAuthInfoAction
  | LoginTooManyPasswordErrorsAction;

interface LoginSuccessAction {
  type: AuthTypes.LOGIN_SUCCESS;
  payload: {
    roles: Role[];
    email: string;
    id: number;
  };
}
interface SetAuthInfoAction {
  type: AuthTypes.AUTH_INFO;
  payload: {
    roles: Role[];
    email: string | undefined;
    id: number | undefined;
  };
}
interface LoginEmailErrorAction {
  type: AuthTypes.LOGIN_EMAIL_ERROR;
}
interface LoginPasswordErrorAction {
  type: AuthTypes.LOGIN_PASSWORD_ERROR;
}
interface LoginBadCredentialsErrorAction {
  type: AuthTypes.LOGIN_BAD_CREDENTIALS_ERROR;
}
interface LoginTooManyPasswordErrorsAction {
  type: AuthTypes.TOO_MANY_PASSWORD_ERRORS;
}
interface LoginGenericErrorAction {
  type: AuthTypes.LOGIN_GENERIC_ERROR;
}
interface LoginResetErrorsAction {
  type: AuthTypes.LOGIN_RESET_ERRORS;
}

export const adminCreateAccount = ({
  email,
  firstName,
  lastName,
  companyName,
  locale,
}: {
  email: string,
  firstName: string,
  lastName: string,
  companyName: string,
  locale: LOCALE,
}): CustomThunkAction => {
  return async (dispatch: Dispatch, getState) => {
    const apiClient = ApiClient.buildFromBrowser();

    await apiClient.post<void>(
      ApiRoutes.ADMIN_ACCOUNT_CREATION, {
      email,
      profile: {
        firstName,
        lastName,
      },
      company: {
        name: companyName
      },
      locale,
    }
    );
  }
};

export const adminImpersonate = ({
  email,
}: {
  email: string,
}): CustomThunkAction => {
  return async (dispatch: Dispatch, getState) => {
    const apiClient = ApiClient.buildFromBrowser();

    const response = await apiClient.post<LoginResponse>(
      ApiRoutes.ADMIN_IMPERSONATE, {
      email,
    }
    );
    const {
      jwtToken,
      refreshToken,
      refreshTokenExpirationDate,
    } = response.data;
    const tokenManager = new BrowserAuthTokenManager();
    tokenManager.saveTokens(
      jwtToken,
      refreshToken,
      refreshTokenExpirationDate
    );

    dispatch(logout());
  }
};

export const setAuthInfo = (customApiClient?: ApiClient) => async (
  dispatch: Dispatch
) => {
  const apiClient = customApiClient ?? ApiClient.buildFromBrowser(false);
  let jwtToken: string;
  try {
    jwtToken = await apiClient.getJwtToken();
  } catch (error: any) {
    if (error instanceof UnauthenticatedError) {
      dispatch<SetAuthInfoAction>({
        type: AuthTypes.AUTH_INFO,
        payload: {
          roles: [Role.ROLE_ANONYMOUS],
          email: undefined,
          id: undefined,
        },
      });
      return;
    }
    throw new Error("Impossible to get JWT");
  }
  const decodedJwt = jwt.decode(jwtToken);
  if (
    typeof decodedJwt === "string" ||
    !decodedJwt?.roles ||
    !decodedJwt?.email ||
    !decodedJwt?.id
  ) {
    throw new Error("Decoded Jwt does not contain roles or email or id");
  }

  const roles = decodedJwt?.roles as Role[];
  const emailResult = decodedJwt?.email as string;
  const userId = parseInt(decodedJwt?.id);
  dispatch<SetAuthInfoAction>({
    type: AuthTypes.AUTH_INFO,
    payload: {
      roles,
      email: emailResult,
      id: userId,
    },
  });
};

interface LoginResponse {
  jwtToken: string;
  refreshToken: string;
  refreshTokenExpirationDate: string;
}
export const login = ({
  email,
  password,
  onSuccess,
}: {
  email: string;
  password: string;
  onSuccess: Function;
}): CustomThunkAction => {
  return async (dispatch: Dispatch) => {
    try {
      const apiClient = ApiClient.buildFromBrowser();
      const response = await apiClient.post<LoginResponse>(
        "/auth/login",
        {
          email,
          password,
        },
        false
      );

      const {
        jwtToken,
        refreshToken,
        refreshTokenExpirationDate,
      } = response.data;
      const tokenManager = new BrowserAuthTokenManager();
      tokenManager.saveTokens(
        jwtToken,
        refreshToken,
        refreshTokenExpirationDate
      );

      const {
        roles,
        emailResult,
      } = onLoginSuccess(dispatch, jwtToken);

      await onSuccess({
        roles,
        email: emailResult,
      });

    } catch (error: any) {
      console.log(error.response);

      if (error.response) {
        if (error.response.status === 401) {
          if (error.response.data?.errors[0]?.message === 'too_many_password_errors') {
            dispatch({
              type: AuthTypes.TOO_MANY_PASSWORD_ERRORS,
            });
          } else {
            dispatch({
              type: AuthTypes.LOGIN_BAD_CREDENTIALS_ERROR,
            });
          }

        } else {
          const errors = error.response.data?.errors as
            | ServerError[]
            | undefined;
          console.log("errors?.length", errors);

          if (errors?.length) {
            errors.forEach((error) => {
              if (error.field === "password") {
                dispatch({
                  type: AuthTypes.LOGIN_PASSWORD_ERROR,
                });
              }
              if (error.field === "email") {
                dispatch({
                  type: AuthTypes.LOGIN_EMAIL_ERROR,
                });
              }
              if (!error.field) {
                dispatch({
                  type: AuthTypes.LOGIN_GENERIC_ERROR,
                });
              }
            });
          }
        }
      } else {
        dispatch({
          type: AuthTypes.LOGIN_GENERIC_ERROR,
        });
      }
    }
  };
};

export const onLoginSuccess = (dispatch: Dispatch, jwtToken: string) => {
  const decodedJwt = jwt.decode(jwtToken);
  if (
    typeof decodedJwt === "string" ||
    !decodedJwt?.roles ||
    !decodedJwt?.email
  ) {
    throw new Error("Decoded Jwt does not contain roles or email");
  }

  const roles = decodedJwt?.roles as Role[];
  const emailResult = decodedJwt?.email as string;
  const userId = parseInt(decodedJwt?.id);
  dispatch<LoginSuccessAction>({
    type: AuthTypes.LOGIN_SUCCESS,
    payload: {
      roles,
      email: emailResult,
      id: userId,
    },
  });

  const apiClient = ApiClient.buildFromBrowser();

  apiClient.post<Analytics>(
    generateRoute(ApiRoutes.ANALYTICS_USER_LOGGED),
    {
      eventName: `${analyticEvents[EventType.USER][UserEventType.LOGGED_IN]}`,
    }
  );

  return {
    roles,
    emailResult,
  }
};

export const loginResetErrors = () => ({
  type: AuthTypes.LOGIN_RESET_ERRORS,
});
export const logout = () => ({
  type: AuthTypes.LOGOUT_SUCCESS,
});
