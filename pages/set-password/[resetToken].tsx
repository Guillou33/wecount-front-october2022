import Head from 'next/head'
import SetPassword from '@components/auth/set-password/SetPassword'
import { ReduxNextPageContext } from '@lib/redux/with-redux-store';
import ApiClient from '@lib/wecount-api/ApiClient';
import { upperFirst } from 'lodash';
import { t } from 'i18next';

interface Props {
  resetToken: string;
  existingResetToken: boolean;
}
const SetPasswordResetPage = (props: Props) => {
  return (
    <>
      <Head>
        <title>{upperFirst(t("global.welcome"))} ! - WeCount</title>
      </Head>
      <SetPassword {...props} />
    </>

  );
};

SetPasswordResetPage.getInitialProps = async (ctx: ReduxNextPageContext) => {
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


export default SetPasswordResetPage;
