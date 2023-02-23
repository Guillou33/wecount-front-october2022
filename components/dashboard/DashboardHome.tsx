import AuthLayout from "@components/layout/AuthLayout";
import useSetOnceAllCampaignInfo from "@hooks/core/reduxSetOnce/useSetOnceAllCampaignInfo";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@reducers/index";
import MainHeader from "@components/core/MainHeader";
import { DashboardView as View } from "@reducers/dashboards/dashboardsReducer";
import { Campaign as CampaignType } from "@reducers/campaignReducer";
import { setCurrentView } from "@actions/dashboards/dashboardsActions";

import useSetAllEntries from "@hooks/core/reduxSetOnce/useSetAllEntries";
import ContentDashboardView from "./campaign/ContentDashboardView";
import { upperFirst } from "lodash";
import { t } from "i18next";

const DashboardHome = () => {
  useSetOnceAllCampaignInfo(true);
  const dispatch = useDispatch();

  const currentView = useSelector<RootState, View>(
    state => state.dashboards.currentView
  );

  const campaignId = useSelector<RootState, number>(
    // Set in getInitialProps
    state => state.campaign.currentCampaign!
  );
  useSetAllEntries(campaignId);


  const campaign = useSelector<RootState, CampaignType | undefined>(
    state => state.campaign.campaigns[campaignId]
  );

  const availableTabs = [
    { label: upperFirst(t("dashboard.overview")), value: View.EMISSION },
    { label: upperFirst(t("site.sites")), value: View.SITES },
    { label: upperFirst(t("product.products")), value: View.PRODUCTS },
    { label: upperFirst(t("indicator.indicators")), value: View.INDICATORS },
    { label: upperFirst(t("dashboard.comparison")), value: View.COMPARISON },
    { label: upperFirst(t("global.common.evolution")), value: View.HISTORY },
    { label: upperFirst(t("reglementation.reglementation")), value: View.REGLEMENTATION },
  ];

  const renderContentDashboard = () => {
    return <ContentDashboardView campaignId={campaignId} />
  };

  return (
    <AuthLayout>
      <MainHeader
        title={upperFirst(t("dashboard.analysis"))}
        menu={"dashboards"}
        campaign={campaign}
        availableTabs={availableTabs}
        currentView={currentView}
        onChange={view => dispatch(setCurrentView(view))}
        currentTrajectory={null}
      />
      <div className="page-content-wrapper">
        {renderContentDashboard()}
      </div>
    </AuthLayout>
  );
};

export default DashboardHome;
