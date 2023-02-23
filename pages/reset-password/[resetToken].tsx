import Head from 'next/head'
import Reset from '@components/auth/reset-password/Reset'
import { ReduxNextPageContext } from '@lib/redux/with-redux-store';
import ApiClient from '@lib/wecount-api/ApiClient';
import { upperFirst } from 'lodash';
import { t } from 'i18next';

interface Props {
  resetToken: string;
  existingResetToken: boolean;
}
const ResetPasswordResetPage = (props: Props) => {
  return (
    <>
      <Head>
        <title>{upperFirst(t("user.account.reInitPassword2"))} - WeCount</title>
      </Head>
      <Reset {...props} />
    </>

  );
};

ResetPasswordResetPage.getInitialProps = async (ctx: ReduxNextPageContext) => {
  let apiClient: ApiClient;
  if (ctx.req) {
    if (!ctx.res) {
      throw new Error("Req is present, but not res");
    }
    apiClient = ApiClient.buildFromServer(ctx.req, ctx.res);
  } else {
    apiClient = ApiClient.buildFromBrowser();
  }

  const { resetToken } = ctx.query;
  if (!resetToken || typeof resetToken !== 'string') {
    throw new Error("Undefined reset token");
  }

  let existingResetToken = true;
  try {
    await apiClient.get<{}>(`/auth/reset-password/reset/${resetToken}`, false);
  } catch (error: any) {
    existingResetToken = false;
  }

  return {
    resetToken,
    existingResetToken
  };
};


export default ResetPasswordResetPage;
