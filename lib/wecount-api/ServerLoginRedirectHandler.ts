import UnauthenticatedHandlerInterface from '@lib/wecount-api/UnauthenticatedHandlerInterface';
import { ServerResponse } from "http";
import redirectToLogin from '@lib/wecount-api/redirectToLogin';

class BrowserUnauthenticatedHandler implements UnauthenticatedHandlerInterface {
  private res: ServerResponse;

  constructor(res: ServerResponse) {
    this.res = res;
  }

  onUnauthenticated(): void {
    redirectToLogin(this.res);
  }
}

export default BrowserUnauthenticatedHandler;
