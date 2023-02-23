import Head from "next/head";
import CampaignReportHome from "@components/campaignReport/CampaignReportHome";
import requireAuth from "@components/hoc/auth/requireAuth";
import { upperFirst } from "lodash";
import { t } from "i18next";

const CampaignReportPage = () => {
  return (
    <>
      <Head>
        <title>{upperFirst(t("dashboard.dashboard"))} - Wecount</title>
      </Head>
      <CampaignReportHome />
    </>
  );
};

export default requireAuth(CampaignReportPage);
