import Head from "next/head";

import { ReduxNextPageContext } from "@lib/redux/with-redux-store";
import { CustomThunkDispatch } from "@custom-types/redux";
import { ApiRoutes, generateRoute } from "@lib/wecount-api/routes/apiRoutes";
import ApiClient from "@lib/wecount-api/ApiClient";
import { CampaignResponse } from "@lib/wecount-api/responses/apiResponses";
import { requestCurrentPerimeterSwitch } from "@actions/perimeter/perimeterActions";

import requireAuth from "@components/hoc/auth/requireAuth";
import { useRouter } from "next/router";
import TrajectoryContainer from "@components/campaign/detail/trajectory/TrajectoryContainer";
import { upperFirst } from "lodash";
import { t } from "i18next";

const TrajectoryPage = () => {
  const router = useRouter();
  const campaignId = Number(router.query.campaignId as string);

  return (
    <>
      <Head>
        <title>{upperFirst(t("trajectory.trajectory"))} - Wecount</title>
      </Head>
      <TrajectoryContainer campaignId={campaignId} />
    </>
  );
};

TrajectoryPage.getInitialProps = async (ctx: ReduxNextPageContext) => {
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

export default requireAuth(TrajectoryPage);
