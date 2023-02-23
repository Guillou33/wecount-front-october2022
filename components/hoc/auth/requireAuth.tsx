import { NextPageContext } from 'next';
import ApiClient from '@lib/wecount-api/ApiClient';
import redirectToLogin from '@lib/wecount-api/redirectToLogin';
import { Role } from '@custom-types/wecount-api/auth';
import jwt from 'jsonwebtoken';
import { UnauthenticatedError } from '@errors/auth/UnauthenticatedError';

const requireAuth = (WrappedComponent: any, roles: Role[] = [Role.ROLE_USER, Role.ROLE_ADMIN]) => {

  const Hoc = (props: any) => {
    return <WrappedComponent {...props} />;
  };

  Hoc.getInitialProps = async (ctx: NextPageContext) => {
    let apiClient: ApiClient;

    if (ctx.req) {
      if (!ctx.res) {
        throw new Error("Req is present, but not res");
      }
      apiClient = ApiClient.buildFromServer(ctx.req, ctx.res, false);
    } else {
      apiClient = ApiClient.buildFromBrowser(false);
    }

    try {
      const jwtToken = await apiClient.getJwtToken();
      const decodedJwt = jwt.decode(jwtToken);
      if (typeof decodedJwt === 'string' || !decodedJwt?.roles || !decodedJwt?.email) {
        throw new Error("Decoded Jwt does not contain roles or email");
      }

      let hasARole = false;
      roles.forEach((role) => {
        if (decodedJwt.roles.indexOf(role) !== -1) {
          hasARole = true;
        }
      });

      if (!hasARole) {
        // Wrong role
        redirectToLogin(ctx.res)
      }
    } catch (error: any) {
      if (error instanceof UnauthenticatedError) {
        redirectToLogin(ctx.res)
      } else {
        throw error;
      }
    }

    if (WrappedComponent.getInitialProps) {
      const wrappedProps = await WrappedComponent.getInitialProps(ctx);
      return { ...wrappedProps };
    }
    return {};
  }

  return Hoc;
}

export default requireAuth;
