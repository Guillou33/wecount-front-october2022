import Head from "next/head";
import requireAuth from "@components/hoc/auth/requireAuth";
import SiteContainer from "@components/userSettings/resource-crud/site/SiteContainer";
import { PerimeterRole } from "@custom-types/wecount-api/auth";
import RequirePerimeterRole from "@components/auth/access-control/RequirePerimeterRole";
import { upperFirst } from "lodash";
import { t } from "i18next";

const SiteSettingsPage = () => {
  return (
    <>
      <Head>
        <title>{upperFirst(t("settings.settings"))} - {upperFirst(t("site.sites"))}</title>
      </Head>
      <RequirePerimeterRole role={PerimeterRole.PERIMETER_MANAGER}>
        <SiteContainer />
      </RequirePerimeterRole>
    </>
  );
};

export default requireAuth(SiteSettingsPage);
