import Head from "next/head";

import { ReduxNextPageContext } from "@lib/redux/with-redux-store";
import { CustomThunkDispatch } from "@custom-types/redux";
import { ApiRoutes, generateRoute } from "@lib/wecount-api/routes/apiRoutes";
import ApiClient from "@lib/wecount-api/ApiClient";
import { CampaignResponse } from "@lib/wecount-api/responses/apiResponses";
import { requestCurrentPerimeterSwitch } from "@actions/perimeter/perimeterActions";

import DashboardHome from "@components/dashboard/DashboardHome";
import requireAuth from "@components/hoc/auth/requireAuth";
import { upperFirst } from "lodash";
import { t } from "i18next";

const DashboardPage = () => {

  return (
    <>
      <Head>
        <title>{upperFirst(t("dashboard.analysis"))} - Wecount</title>
      </Head>
      <DashboardHome />
    </>
  );
};

DashboardPage.getInitialProps = async (ctx: ReduxNextPageContext) => {
  const campaignId = parseInt(ctx.query["campaignId"]! as string);
  const dispatch = ctx.store.dispatch as CustomThunkDispatch;

  if (ctx.req) {
    if (!ctx.res) {
      throw new Error("Req is present, but not res");
    }
    const apiClient = ApiClient.buildFromServer(ctx.req, ctx.res);
    const response = await apiClient.get<CampaignResponse>(
      generateRoute(ApiRoutes.CAMPAIGN, { id: campaignId })
    );
    dispatch(requestCurrentPerimeterSwitch(response.data.perimeterId));
  }
}

export default requireAuth(DashboardPage);
