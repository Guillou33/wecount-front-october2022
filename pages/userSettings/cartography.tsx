import Head from 'next/head'
import requireAuth from '@components/hoc/auth/requireAuth';
import CartographySettings from "@components/userSettings/CartographySettings";
import { PerimeterRole } from '@custom-types/wecount-api/auth';
import RequirePerimeterRole from '@components/auth/access-control/RequirePerimeterRole';
import { upperFirst } from 'lodash';
import { t } from 'i18next';

const CartographySettingsPage = () => {
  return (
    <>
      <Head>
        <title>{upperFirst(t("settings.settings"))} - {upperFirst(t("cartography.cartographyResults"))}</title>
      </Head>
      <RequirePerimeterRole role={PerimeterRole.PERIMETER_MANAGER}>
        <CartographySettings />
      </RequirePerimeterRole>
    </>
  );
};

export default requireAuth(CartographySettingsPage);