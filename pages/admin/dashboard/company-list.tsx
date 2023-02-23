import Head from 'next/head'
import requireAuth from "@components/hoc/auth/requireAuth";
import { Role } from '@custom-types/wecount-api/auth'
import CompanyList from '@components/admin/dashboad/company-list/CompanyList';
import { t } from 'i18next';
import { upperFirst } from 'lodash';

const AdminCompanyListPage = () => {
  return (
    <>
      <Head>
        <title>{upperFirst(t("company.companies"))} - {upperFirst(t("user.role.title.admin"))} - WeCount</title>
      </Head>
      <CompanyList />
    </>
  );
};

export default requireAuth(AdminCompanyListPage, [Role.ROLE_ADMIN]);
