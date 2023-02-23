import AbstractAuthTokenManager from '@lib/wecount-api/AbstractAuthTokenManager';
import Cookies from 'js-cookie';
import {
  COOKIE_AUTH_TOKEN_KEY,
  COOKIE_REFRESH_TOKEN_KEY,
} from '@lib/wecount-api/AbstractAuthTokenManager';


class BrowserAuthTokenManager extends AbstractAuthTokenManager {
  protected retrieveAuthTokens(): void {
    const jwtToken = Cookies.get(COOKIE_AUTH_TOKEN_KEY)!;
    const refreshToken = Cookies.get(COOKIE_REFRESH_TOKEN_KEY)!;

    this.authTokens = { jwtToken, refreshToken };
  }

  saveTokens(jwtToken: string, refreshToken: string, refreshTokenExpirationDate: string): void {
    Cookies.set(COOKIE_AUTH_TOKEN_KEY, jwtToken, {
      expires: new Date(this.getJwtExpirationTimestamp(jwtToken) * 1000),
      path: "/"
    });
    Cookies.set(COOKIE_REFRESH_TOKEN_KEY, refreshToken, {
      expires: new Date(refreshTokenExpirationDate),
      path: "/"
    });
  }
}
export default BrowserAuthTokenManager;
