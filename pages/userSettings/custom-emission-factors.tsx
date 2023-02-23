import Head from "next/head";
import requireAuth from "@components/hoc/auth/requireAuth";
import Cef from "@components/userSettings/resource-crud/cef/Cef";
import { PerimeterRole } from "@custom-types/wecount-api/auth";
import RequirePerimeterRole from "@components/auth/access-control/RequirePerimeterRole";
import { upperFirst } from "lodash";
import { t } from "i18next";

const CefSettingsPage = () => {
  return (
    <>
      <Head>
        <title>{upperFirst(t("settings.settings"))} - {upperFirst(t("cef.cefs"))}</title>
      </Head>
      <RequirePerimeterRole role={PerimeterRole.PERIMETER_MANAGER}>
        <Cef />
      </RequirePerimeterRole>
    </>
  );
};

export default requireAuth(CefSettingsPage);
