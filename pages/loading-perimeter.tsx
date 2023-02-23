import Head from "next/head";
import requireAuth from "@components/hoc/auth/requireAuth";

import PerimeterLoader from "@components/perimeter/PerimeterLoader";
import { t } from "i18next";
import { upperFirst } from "lodash";

const LoadingPerimeterPage = () => {
  return (
    <>
      <Head>
        <title>{upperFirst(t("campaign.campaigns"))} - Wecount</title>
      </Head>
      <PerimeterLoader />
    </>
  );
};

export default requireAuth(LoadingPerimeterPage);
