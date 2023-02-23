import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axiosInstance from '@lib/wecount-api/axiosInstance';
import AbstractAuthTokenManager from '@lib/wecount-api/AbstractAuthTokenManager';
import ServerAuthTokenManager from '@lib/wecount-api/ServerAuthTokenManager';
import BrowserAuthTokenManager from '@lib/wecount-api/BrowserAuthTokenManager';
import UnauthenticatedHandlerInterface from '@lib/wecount-api/UnauthenticatedHandlerInterface';
import ServerLoginRedirectHandler from '@lib/wecount-api/ServerLoginRedirectHandler';
import BrowserLoginRedirectHandler from '@lib/wecount-api/BrowserLoginRedirectHandler';
import InactiveUnauthenticatedHandler from '@lib/wecount-api/InactiveUnauthenticatedHandler';
import { IncomingMessage, ServerResponse } from 'http';
import { UnauthenticatedError } from '@errors/auth/UnauthenticatedError';

enum Methods {
  get = 'get',
  post = 'post',
  put = 'put',
  patch = 'patch',
  delete = 'delete',
};

class ApiClient {
  private authTokenManager: AbstractAuthTokenManager;
  private httpClient: AxiosInstance;
  private unauthenticatedHandler: UnauthenticatedHandlerInterface;

  static buildFromBrowser(handleUnauthenticated: boolean = true) {
    const unauthenticatedHandler: UnauthenticatedHandlerInterface = handleUnauthenticated ? (new BrowserLoginRedirectHandler()) : (new InactiveUnauthenticatedHandler());
    return new ApiClient(unauthenticatedHandler);
  }
  static buildFromServer(req: IncomingMessage, res: ServerResponse, handleUnauthenticated: boolean = true) {
    const unauthenticatedHandler: UnauthenticatedHandlerInterface = handleUnauthenticated ? (new ServerLoginRedirectHandler(res)) : (new InactiveUnauthenticatedHandler());
    return new ApiClient(unauthenticatedHandler, req, res);
  }

  constructor(unauthenticatedHandler: UnauthenticatedHandlerInterface, req?: IncomingMessage, res?: ServerResponse) {
    this.unauthenticatedHandler = unauthenticatedHandler;
    this.httpClient = axiosInstance;
    if (req && res) {
      this.authTokenManager = new ServerAuthTokenManager(req, res);
    } else {
      this.authTokenManager = new BrowserAuthTokenManager();
    }
  }

  get<T>(url: string, hasAuth: boolean = true, config: AxiosRequestConfig = {}) {
    return this.requestAndHandleUnauthenticated<T>(Methods.get, url, hasAuth, config);
  }
  delete<T>(url: string, hasAuth: boolean = true, config: AxiosRequestConfig = {}) {
    return this.requestAndHandleUnauthenticated<T>(Methods.delete, url, hasAuth, config);
  }
  post<T>(url: string, data: any, hasAuth: boolean = true, config: AxiosRequestConfig = {}) {
    config.data = data;
    return this.requestAndHandleUnauthenticated<T>(Methods.post, url, hasAuth, config);
  }
  patch<T>(url: string, data: any, hasAuth: boolean = true, config: AxiosRequestConfig = {}) {
    config.data = data;
    return this.requestAndHandleUnauthenticated<T>(Methods.patch, url, hasAuth, config);
  }
  put<T>(url: string, data: any, hasAuth: boolean = true, config: AxiosRequestConfig = {}) {
    config.data = data;
    return this.requestAndHandleUnauthenticated<T>(Methods.put, url, hasAuth, config);
  }

  async getJwtToken(): Promise<string> {
    let tokens = this.authTokenManager.getAuthTokens();

    if (!tokens.jwtToken) {
      if (tokens.refreshToken) {
        try {
          await this.refresh();
        } catch (error: any) {
          console.error(error);
        }

        tokens = this.authTokenManager.getAuthTokens();
        if (!tokens.jwtToken) {
          console.log('UnauthenticatedError', 1);
          throw new UnauthenticatedError();
        }
      } else {
        console.log('UnauthenticatedError', 2);
        throw new UnauthenticatedError();
      }
    }
    return tokens.jwtToken;
  }

  private async getAuthHeader(): Promise<{ [key: string]: string }> {
    const jwtToken = await this.getJwtToken();
    return {
      Authorization: `Bearer ${jwtToken}`,
    };
  }

  private async getRequestConfig(method: Methods, url: string, hasAuth: boolean = true, config: AxiosRequestConfig): Promise<AxiosRequestConfig> {
    const configHeaders = config?.headers ?? {};
    let authHeaders: { [key: string]: string } = {};

    if (hasAuth) {
      authHeaders = await this.getAuthHeader();
    }

    const headers = hasAuth ? {
      ...authHeaders,
      ...configHeaders
    } : configHeaders;
    return {
      method: method,
      url: url,
      headers: headers,
      ...config
    };
  }

  async refresh(): Promise<void> {
    const tokens = this.authTokenManager.getAuthTokens();
    if (!tokens.refreshToken) {
      console.log('UnauthenticatedError', 3);
      throw new UnauthenticatedError();
    }

    let refreshResponse: AxiosResponse<any> | undefined;
    try {
      refreshResponse = await this.post('auth/refresh', {
        refreshToken: tokens.refreshToken
      }, false);
    } catch (error: any) {
      if (error.response?.status === 400) {
        console.log('UnauthenticatedError', 4);
        throw new UnauthenticatedError();
      }
      throw error;
    }

    const refreshToken = refreshResponse.data?.refreshToken
    const refreshTokenExpirationDate = refreshResponse.data?.refreshTokenExpirationDate
    const jwtToken = refreshResponse.data?.jwtToken
    if (!refreshToken || !jwtToken || !refreshTokenExpirationDate) {
      throw new Error("Unconsistant refresh tokens");
    }
    this.authTokenManager.saveTokens(jwtToken, refreshToken, refreshTokenExpirationDate);
  }

  async requestAndHandleUnauthenticated<T = any>(method: Methods, url: string, hasAuth: boolean, config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      return await this.request(method, url, hasAuth, config);
    } catch (error: any) {
      if (error instanceof UnauthenticatedError) {
        this.unauthenticatedHandler.onUnauthenticated();
      }
      throw error;
    }
  }

  async request<T = any>(method: Methods, url: string, hasAuth: boolean, config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    const requestConfig = await this.getRequestConfig(method, url, hasAuth, config);
    let response: AxiosResponse<T>;

    try {
      response = await this.httpClient.request<T>(requestConfig);
    } catch (error: any) {

      if (error.response?.status === 401 && hasAuth) {
        await this.refresh();
        const newRequestConfig = await this.getRequestConfig(method, url, hasAuth, config);
        response = await this.httpClient.request<T>(newRequestConfig);
      } else {
        throw error;
      }
    }

    return response;
  }
}
export default ApiClient;
