import { setCurrentCampaign } from "@actions/campaign/campaignActions";
import { setActivityCategories } from "@actions/core/category/categoryActions";
import { requestCurrentPerimeterSwitch } from "@actions/perimeter/perimeterActions";
import RequirePerimeterRole from "@components/auth/access-control/RequirePerimeterRole";
import requireAuth from "@components/hoc/auth/requireAuth";
import DataImport from "@components/userSettings/resource-crud/site/data-import/DataImport";
import { CustomThunkDispatch } from "@custom-types/redux";
import { PerimeterRole } from "@custom-types/wecount-api/auth";
import { ReduxNextPageContext } from "@lib/redux/with-redux-store";
import ApiClient from "@lib/wecount-api/ApiClient";
import { CampaignResponse } from "@lib/wecount-api/responses/apiResponses";
import { ApiRoutes, generateRoute } from "@lib/wecount-api/routes/apiRoutes";
import { CategoryState } from "@reducers/core/categoryReducer";
import Head from "next/head";

const DataImportPage = () => {
    return (
      <>
        <Head>
          <title>Import - Wecount</title>
        </Head>
        <RequirePerimeterRole role={PerimeterRole.PERIMETER_MANAGER}>
          <DataImport />
        </RequirePerimeterRole>
      </>
    );
};

// DataImportPage.getInitialProps = async (ctx: ReduxNextPageContext) => {
//     const campaignId = parseInt(ctx.query["campaignId"]! as string);
//     const dispatch = ctx.store.dispatch as CustomThunkDispatch;
  
//     if (ctx.req) {
//       if (!ctx.res) {
//         throw new Error("Req is present, but not res");
//       }
//       const apiClient = ApiClient.buildFromServer(ctx.req, ctx.res);
//       const response = await apiClient.get<CampaignResponse>(
//         generateRoute(ApiRoutes.CAMPAIGN, { id: campaignId })
//       );
//       dispatch(requestCurrentPerimeterSwitch(response.data.perimeterId));
  
//       const categoryState: CategoryState = ctx.store.getState().core.category;
//       if (!categoryState.isSet) {
//         await dispatch(setActivityCategories(apiClient));
//       }
//     }
  
//     await dispatch(setCurrentCampaign({ campaignId }));
  
//     return {
//       key: campaignId,
//     };
//   };
  

export default requireAuth(DataImportPage);