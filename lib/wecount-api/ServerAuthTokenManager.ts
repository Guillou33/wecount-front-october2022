import AbstractAuthTokenManager, {
  COOKIE_AUTH_TOKEN_KEY,
  COOKIE_REFRESH_TOKEN_KEY,
} from "@lib/wecount-api/AbstractAuthTokenManager";
import { IncomingMessage, ServerResponse } from "http";
import { UnauthenticatedError } from '@errors/auth/UnauthenticatedError';
import cookie from "cookie";

class ServerAuthTokenManager extends AbstractAuthTokenManager {
  private req: IncomingMessage;
  private res: ServerResponse;

  constructor(req: IncomingMessage, res: ServerResponse) {
    super();
    this.req = req;
    this.res = res;
  }

  protected retrieveAuthTokens(): void {
    // If no cookie or response has been sent (stop any try for auth, since response is sent)
    if (!this.req.headers.cookie || this.res.writableEnded) {
      console.log('UnauthenticatedError', 5);
      throw new UnauthenticatedError();
    }
    const reqCookies = cookie.parse(this.req.headers.cookie);
    const jwtToken = reqCookies[COOKIE_AUTH_TOKEN_KEY];
    const refreshToken = reqCookies[COOKIE_REFRESH_TOKEN_KEY];

    this.authTokens = { jwtToken, refreshToken };
  }

  saveTokens(jwtToken: string, refreshToken: string, refreshTokenExpirationDate: string): void {
    this.res.setHeader(
      "Set-Cookie",
      [
        cookie.serialize(COOKIE_REFRESH_TOKEN_KEY, refreshToken, {
          httpOnly: false,
          expires: new Date(refreshTokenExpirationDate),
          path: "/",
        }),
        cookie.serialize(COOKIE_AUTH_TOKEN_KEY, jwtToken, {
          httpOnly: false,
          expires: new Date(this.getJwtExpirationTimestamp(jwtToken) * 1000),
          path: "/",
        }),
      ]
    );

    this.authTokens.refreshToken = refreshToken;
    this.authTokens.jwtToken = jwtToken;
  }
}
export default ServerAuthTokenManager;
