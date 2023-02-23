import Head from 'next/head'
import requireAuth from "@components/hoc/auth/requireAuth";
import { Role } from '@custom-types/wecount-api/auth'
import LockedCompanyList from '@components/admin/dashboad/company-list/LockedCompanyList';
import { upperFirst } from 'lodash';
import { t } from 'i18next';

const AdminCompanyListPage = () => {
  return (
    <>
      <Head>
        <title>{upperFirst(t("company.block.blockedCompanies"))} - {upperFirst(t("user.role.title.admin"))} - WeCount</title>
      </Head>
      <LockedCompanyList />
    </>
  );
};

export default requireAuth(AdminCompanyListPage, [Role.ROLE_ADMIN]);
