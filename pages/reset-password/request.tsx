import Head from 'next/head'
import Request from '@components/auth/reset-password/Request';
import { upperFirst } from 'lodash';
import { t } from 'i18next';

const ResetPasswordRequestPage = () => {
  return (
    <>
      <Head>
        <title>{upperFirst(t("user.account.reInitPassword2"))} - WeCount</title>
      </Head>
      <Request />
    </>
    
  );
};

export default ResetPasswordRequestPage;
