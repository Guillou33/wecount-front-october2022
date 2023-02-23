import { useDispatch } from "react-redux";
import { useState } from "react";

import useAllEntriesInfoTotal from "@hooks/core/activityEntryInfo/useAllEntriesInfoTotal";

import SiteOrProductChart, {
  ChartType,
} from "@components/campaignReport/sub/SiteOrProductChart";
import Tabs from "@components/helpers/ui/Tabs";
import ReportLink from "@components/campaignReport/sub/ReportLink";

import { setCurrentView } from "@actions/dashboards/dashboardsActions";
import { DashboardView } from "@reducers/dashboards/dashboardsReducer";

import styles from "@styles/campaignReports/sub/siteOrProductChart.module.scss";
import { upperFirst } from "lodash";
import { t } from "i18next";

interface Props {
  campaignId: number;
}

const SiteOrProductReport = ({ campaignId }: Props) => {
  const dispatch = useDispatch();
  const [displayedChart, setDisplayedChart] = useState<ChartType>("site");

  const hasEmissions = useAllEntriesInfoTotal(campaignId).tCo2 > 0;

  function goToSiteOrProductDashboard() {
    const chartView =
      displayedChart === "site" ? DashboardView.SITES : DashboardView.PRODUCTS;
    dispatch(setCurrentView(chartView));
  }

  return (
    <div className={styles.siteProductChart}>
      <Tabs
        tabItems={[
          {
            label: upperFirst(t("site.sites")),
            value: "site",
          },
          {
            label: upperFirst(t("product.products")),
            value: "product",
          },
        ]}
        value={displayedChart}
        onChange={setDisplayedChart}
        className={styles.chartTypeTabs}
      />
      <SiteOrProductChart
        campaignId={campaignId}
        displayedChart={displayedChart}
      />
      {hasEmissions ? (
        <ReportLink
          href={`/dashboards/${campaignId}`}
          onClick={goToSiteOrProductDashboard}
        />
      ) : (
        <ReportLink href={`/campaigns/${campaignId}`}>
          {upperFirst(t("global.beginPrompt"))}
        </ReportLink>
      )}
    </div>
  );
};

export default SiteOrProductReport;
