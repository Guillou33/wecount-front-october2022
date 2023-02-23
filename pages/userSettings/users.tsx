import Head from 'next/head'
import requireAuth from '@components/hoc/auth/requireAuth';
import User from '@components/userSettings/resource-crud/user/User';
import { Role } from '@custom-types/wecount-api/auth';
import { PerimeterRole } from '@custom-types/wecount-api/auth';
import RequirePerimeterRole from '@components/auth/access-control/RequirePerimeterRole';
import { t } from 'i18next';
import { upperFirst } from 'lodash';

const UserSettingsPage = () => {
  return (
    <>
      <Head>
        <title>{upperFirst(t("settings.settings"))} - {upperFirst(t("user.users"))}</title>
      </Head>
      <RequirePerimeterRole role={PerimeterRole.PERIMETER_MANAGER}>
        <User />
      </RequirePerimeterRole>
    </>
  );
};

export default requireAuth(UserSettingsPage);