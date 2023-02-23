import { NextPageContext } from 'next';
import { Routes } from '@custom-types/core/routes';
import redirectFromAnywhere from '@lib/utils/redirectFromAnywhere';
import ApiClient from '@lib/wecount-api/ApiClient';
import jwt from "jsonwebtoken";
import { CustomThunkDispatch } from '@custom-types/redux';
import { ReduxNextPageContext } from '@lib/redux/with-redux-store';
import { onLoginSuccess } from '@actions/auth/authActions';
import { loginRedirect } from '@lib/core/auth/loginRedirect';

const IndexPage = () => {
  return (
    <>
    </>
  );
};


IndexPage.getInitialProps = async (ctx: ReduxNextPageContext) => {
  const dispatch = ctx.store.dispatch as CustomThunkDispatch;

  let apiClient;

  if (ctx.req) {
    if (!ctx.res) {
      throw new Error("Req is present, but not res");
    }
    apiClient = ApiClient.buildFromServer(ctx.req, ctx.res, false);
  } else {
    apiClient = ApiClient.buildFromBrowser(false);
  }

  let jwtToken: string;
  try {
    jwtToken = await apiClient.getJwtToken();
    const decodedJwt = jwt.decode(jwtToken);

    if (
      typeof decodedJwt === "string" ||
      !decodedJwt?.roles ||
      !decodedJwt?.email
    ) {
      throw new Error("Decoded Jwt does not contain roles or email");
    }
  } catch (error: any) {
    redirectFromAnywhere(Routes.LOGIN, Routes.LOGIN, ctx.res);
    return;
  }

  onLoginSuccess(dispatch, jwtToken);
  const redirectInfo = await loginRedirect(apiClient);
  redirectFromAnywhere(redirectInfo.path, redirectInfo.as, ctx.res);
};

export default IndexPage;
