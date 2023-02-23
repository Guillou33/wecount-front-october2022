import jwt from 'jsonwebtoken';

export interface AuthTokens {
  jwtToken?: string;
  refreshToken?: string;
}

export const COOKIE_AUTH_TOKEN_KEY = 'atoken';
export const COOKIE_REFRESH_TOKEN_KEY = 'rtoken';


abstract class AbstractAuthTokenManager {
  protected authTokens: AuthTokens = {};

  getAuthTokens(): AuthTokens {
    if (!this.authTokens.jwtToken || !this.authTokens.refreshToken) {
      this.retrieveAuthTokens()
    }
    return this.authTokens;
  }

  protected getJwtExpirationTimestamp(jwtToken: string): number {
    const decodedJwt = jwt.decode(jwtToken);
    if (typeof decodedJwt === 'string' || !decodedJwt?.exp) {
      throw new Error("Decoded Jwt does not contain exp");
    }

    return decodedJwt.exp;
  }

  protected abstract retrieveAuthTokens(): void
  abstract saveTokens(jwtToken: string, refreshToken: string, refreshTokenExpirationDate: string): void
}

export default AbstractAuthTokenManager;
