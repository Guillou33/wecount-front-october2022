import Head from 'next/head'
import requireAuth from "@components/hoc/auth/requireAuth";
import { Role } from '@custom-types/wecount-api/auth'
import NewAccount from '@components/auth/admin/NewAccount';
import { upperFirst } from 'lodash';
import { t } from 'i18next';

const NewAccountPage = () => {
  return (
    <>
      <Head>
        <title>{upperFirst(t("user.account.new.new"))} - WeCount</title>
      </Head>
      <NewAccount />
    </>
    
  );
};

export default requireAuth(NewAccountPage, [Role.ROLE_ADMIN]);
