import ApiClient from "@lib/wecount-api/ApiClient";
import Head from "next/head";
import Campaign from "@components/campaign/detail/Campaign";
import requireAuth from "@components/hoc/auth/requireAuth";
import { ReduxNextPageContext } from "@lib/redux/with-redux-store";
import { setCurrentCampaign } from "@actions/campaign/campaignActions";
import { setActivityCategories } from "@actions/core/category/categoryActions";
import { CustomThunkDispatch } from "@custom-types/redux";
import { CategoryState } from "@reducers/core/categoryReducer";
import { RootState } from "@reducers/index";
import { requestFetchAllEntries } from "@actions/entries/campaignEntriesAction";
import { loadCampaignListingPreferences } from "@actions/userPreference/campaignListing/campaignListingActions";
import { ApiRoutes, generateRoute } from "@lib/wecount-api/routes/apiRoutes";
import { CampaignResponse } from "@lib/wecount-api/responses/apiResponses";
import { requestCurrentPerimeterSwitch } from "@actions/perimeter/perimeterActions";
import useTranslate from "@hooks/core/translation/useTranslate";
import { upperFirst } from "lodash";

const MainCampaignPage = () => {
  const t = useTranslate();

  return (
    <>
      <Head>
        <title>{upperFirst(t('campaign.campaign'))} - WeCount</title>
      </Head>
      <Campaign />
    </>
  );
};

MainCampaignPage.getInitialProps = async (ctx: ReduxNextPageContext) => {
  const campaignId = parseInt(ctx.query["campaignId"]! as string);
  const dispatch = ctx.store.dispatch as CustomThunkDispatch;
  await dispatch(setCurrentCampaign({ campaignId }));

  if (ctx.req) {
    if (!ctx.res) {
      throw new Error("Req is present, but not res");
    }
    const apiClient = ApiClient.buildFromServer(ctx.req, ctx.res);
    const response = await apiClient.get<CampaignResponse>(
      generateRoute(ApiRoutes.CAMPAIGN, { id: campaignId })
    );
    dispatch(requestCurrentPerimeterSwitch(response.data.perimeterId));

    const categoryState: CategoryState = ctx.store.getState().core.category;
    if (!categoryState.isSet) {
      await dispatch(setActivityCategories(apiClient));
    }

    dispatch(requestFetchAllEntries(campaignId, apiClient));
    await new Promise<void>(resolve => {
      const checkFetchedEntries = setInterval(() => {
        const entries = ctx.store.getState().campaignEntries[campaignId];
        if (entries != null) {
          resolve();
          clearInterval(checkFetchedEntries);
        }
      }, 10);
    });

    await dispatch(loadCampaignListingPreferences(campaignId, apiClient));
    // await dispatch(sendViewCampaign({ eventName: CampaignEventType.VIEW, campaignId: campaignId }));
  } else {
    const state = ctx.store.getState() as RootState;
    const currentCampaignPerimeter = state.campaign.campaigns[campaignId]?.information?.perimeterId;
    const currentPerimeter = state.perimeter.currentPerimeter;

    if (currentPerimeter == null || currentCampaignPerimeter !== currentPerimeter) {
      const apiClient = ApiClient.buildFromBrowser();
      const response = await apiClient.get<CampaignResponse>(
        generateRoute(ApiRoutes.CAMPAIGN, { id: campaignId })
        );
      dispatch(requestCurrentPerimeterSwitch(response.data.perimeterId));
    }
  }

  // TUTO : to unmount all components
  return {
    key: campaignId,
  };
};

export default requireAuth(MainCampaignPage);
