import Head from 'next/head'
import requireAuth from "@components/hoc/auth/requireAuth";
import { Role } from '@custom-types/wecount-api/auth'
import Impersonate from '@components/auth/admin/Impersonate';
import { upperFirst } from 'lodash';
import { t } from 'i18next';

const ImpersonatePage = () => {
  return (
    <>
      <Head>
        <title>{upperFirst(t("user.account.otherAccount.connectionToAccount"))} - WeCount</title>
      </Head>
      <Impersonate />
    </>
    
  );
};

export default requireAuth(ImpersonatePage, [Role.ROLE_ADMIN, Role.ROLE_CONSULTANT]);
