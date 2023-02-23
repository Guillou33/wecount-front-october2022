import UnauthenticatedHandlerInterface from '@lib/wecount-api/UnauthenticatedHandlerInterface';
import redirectToLogin from '@lib/wecount-api/redirectToLogin';

class BrowserUnauthenticatedHandler implements UnauthenticatedHandlerInterface {
  onUnauthenticated(): void {
    redirectToLogin();
  }
}

export default BrowserUnauthenticatedHandler;
