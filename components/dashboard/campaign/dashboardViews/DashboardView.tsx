import EmissionDashboards from "@components/dashboard/campaign/dashboardViews/EmissionDashboards";
import ComparisonDashboards from "@components/dashboard/campaign/dashboardViews/comparisonDashboards/ComparisonDashboards";
import ReglementationDashboards from "@components/dashboard/campaign/dashboardViews/ReglementationDashboards";
import SitesDashboards from "@components/dashboard/campaign/dashboardViews/SitesDashboards";
import ProductsDashboards from "@components/dashboard/campaign/dashboardViews/ProductsDashboards";
import IndicatorsDashboards from "@components/dashboard/campaign/dashboardViews/IndicatorsDashboards";
import TrajectoryDashboards from "@components/dashboard/campaign/dashboardViews/TrajectoryDashboards";
import HistoryDashboards from "@components/dashboard/campaign/dashboardViews/HistoryDashboards";

import useCategoryInfo from "@hooks/core/useCategoryInfo";

import { useSelector } from "react-redux";
import { CampaignInformation } from "@reducers/campaignReducer";
import { RootState } from "@reducers/index";
import { DashboardView as View } from "@reducers/dashboards/dashboardsReducer";

interface Props {
  currentView: View;
  campaignId: number;
  resultTco2Total: number;
}

const DashboardView = ({ currentView, campaignId, resultTco2Total }: Props) => {
  const categoryInfo = useCategoryInfo();

  const campaignInformation = useSelector<
    RootState,
    CampaignInformation | undefined
  >(state => state.campaign.campaigns[campaignId]?.information);

  return (
    <>
      {currentView === View.EMISSION && (
        <EmissionDashboards
          campaignId={campaignId}
          campaignName={campaignInformation?.name}
          resultTco2Total={resultTco2Total}
          categoryInfo={categoryInfo}
        />
      )}
      {currentView === View.COMPARISON && (
        <ComparisonDashboards
          campaignId={campaignId}
          campaignInformation={campaignInformation}
        />
      )}
      {currentView === View.REGLEMENTATION && (
        <ReglementationDashboards campaignId={campaignId} />
      )}
      {currentView === View.SITES && (
        <SitesDashboards campaignId={campaignId} />
      )}
      {currentView === View.PRODUCTS && (
        <ProductsDashboards campaignId={campaignId} />
      )}
      {currentView === View.INDICATORS && (
        <IndicatorsDashboards campaignId={campaignId} />
      )}
      {currentView === View.TRAJECTORY && (
        <TrajectoryDashboards campaignId={campaignId} />
      )}
      {currentView === View.HISTORY && (
        <HistoryDashboards campaignId={campaignId} />
      )}
    </>
  );
};

export default DashboardView;
