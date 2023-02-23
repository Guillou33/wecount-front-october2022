import UnauthenticatedHandlerInterface from '@lib/wecount-api/UnauthenticatedHandlerInterface';
import { UnauthenticatedError } from '@errors/auth/UnauthenticatedError';

class InactiveUnauthenticatedHandler implements UnauthenticatedHandlerInterface {
  onUnauthenticated(): void {
    throw new UnauthenticatedError();
  }
}

export default InactiveUnauthenticatedHandler;
