import Head from "next/head";
import PerimeterHome from "@components/perimeter/PerimeterHome";
import requireAuth from "@components/hoc/auth/requireAuth";
import { Role } from "@custom-types/wecount-api/auth";
import { upperFirst } from "lodash";
import { t } from "i18next";

const PerimeterPage = () => {
  return (
    <>
      <Head>
        <title>{upperFirst(t("perimeter.perimeterManagement"))}</title>
      </Head>
      <PerimeterHome />
    </>
  );
};

export default requireAuth(PerimeterPage, [Role.ROLE_MANAGER, Role.ROLE_ADMIN]);
