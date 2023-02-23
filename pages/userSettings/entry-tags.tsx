import Head from "next/head";

import { PerimeterRole } from "@custom-types/wecount-api/auth";

import requireAuth from "@components/hoc/auth/requireAuth";

import EntryTag from "@components/userSettings/resource-crud/entryTags/EntryTag";
import RequirePerimeterRole from "@components/auth/access-control/RequirePerimeterRole";
import { upperFirst } from "lodash";
import { t } from "i18next";

const SiteSettingsPage = () => {
  return (
    <>
      <Head>
        <title>{upperFirst(t("settings.settings"))} - {upperFirst(t("tag.tags"))}</title>
      </Head>
      <RequirePerimeterRole role={PerimeterRole.PERIMETER_MANAGER}>
        <EntryTag />
      </RequirePerimeterRole>
    </>
  );
};

export default requireAuth(SiteSettingsPage);