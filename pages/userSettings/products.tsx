import Head from 'next/head'
import requireAuth from '@components/hoc/auth/requireAuth';
import Product from '@components/userSettings/resource-crud/product/Product';
import { PerimeterRole } from '@custom-types/wecount-api/auth';
import RequirePerimeterRole from '@components/auth/access-control/RequirePerimeterRole';
import { upperFirst } from 'lodash';
import { t } from 'i18next';

const ProductSettingsPage = () => {
  return (
    <>
      <Head>
        <title>{upperFirst(t("settings.settings"))} - {upperFirst(t("product.products"))}</title>
      </Head>
      <RequirePerimeterRole role={PerimeterRole.PERIMETER_MANAGER}>
        <Product />
      </RequirePerimeterRole>
    </>
  );
};

export default requireAuth(ProductSettingsPage);