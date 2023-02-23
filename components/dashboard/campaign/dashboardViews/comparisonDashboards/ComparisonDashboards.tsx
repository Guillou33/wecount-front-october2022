import { CampaignInformation } from "@reducers/campaignReducer";
import { useEffect, useState } from "react";

import Tabs from "@components/helpers/ui/Tabs";

import ComparisonChartsTab from "@components/dashboard/campaign/dashboardViews/comparisonDashboards/ComparisonChartsTab";
import HistoryTableTab from "@components/dashboard/campaign/dashboardViews/comparisonDashboards/HistoryTableTab";
import WaterfallTab from "@components/dashboard/campaign/dashboardViews/comparisonDashboards/WaterfallTab";

import { keepOnlyEntriesForCampaign } from "@actions/entries/campaignEntriesAction";
import styles from "@styles/dashboard/campaign/campaignDashboard.module.scss";
import { t } from "i18next";
import { upperFirst } from "lodash";
import { useDispatch } from "react-redux";

interface Props {
  campaignId: number;
  campaignInformation: CampaignInformation | undefined;
}

const ComparisonDashboards = ({ campaignId, campaignInformation }: Props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch(keepOnlyEntriesForCampaign({campaignId}));
    };
  }, []);
  const [comparisonTab, setComparisonTab] = useState<
    "chart" | "table" | "waterfall"
  >("chart");

  return (
    <>
      <Tabs
        value={comparisonTab}
        onChange={setComparisonTab}
        className={styles.comparisonTabs}
        tabItems={[
          {
            label: upperFirst(t("dashboard.graph")),
            value: "chart",
          },
          {
            label: upperFirst(t("dashboard.waterfallTab")),
            value: "waterfall",
          },
          {
            label: upperFirst(t("cartography.list")),
            value: "table",
          },
        ]}
      />
      {comparisonTab === "chart" && (
        <ComparisonChartsTab currentCampaignId={campaignId} />
      )}
      {comparisonTab === "table" && (
        <HistoryTableTab
          campaignId={campaignId}
          campaignInformation={campaignInformation}
        />
      )}
      {comparisonTab === "waterfall" && (
        <WaterfallTab
          campaignId={campaignId}
          campaignInformation={campaignInformation}
        />
      )}
    </>
  );
};

export default ComparisonDashboards;
