import { t } from "i18next";
import { upperFirst } from "lodash";
import { useSelector } from "react-redux";

import cx from "classnames";
import OverviewTable from "@components/dashboard/campaign/sub/OverviewTable";
import styles from "@styles/dashboard/campaign/campaignDashboard.module.scss";
import { RootState } from "@reducers/index";

import AllSitesChart from "@components/dashboard/campaign/sub/AllSitesChart";

import selectFilteredActivityEntriesForAnalysis from "@selectors/activityEntries/selectFilteredActivityEntriesForAnalysis";

interface Props {
  campaignId: number;
}

const SitesDashboards = ({ campaignId }: Props) => {
  const filteredEntries = useSelector((state: RootState) =>
    selectFilteredActivityEntriesForAnalysis(state, campaignId)
  );

  return (
    <>
      <div className={cx("alert alert-primary", styles.dashboardInfos)}>
        <p>
          {upperFirst(t("site.info"))} <b>{t("site.sites")}</b>
        </p>
      </div>
      <div className={styles.categoriesDashboardContainer}>
        <div className={cx(styles.titleContainer, styles.overviewTableTitle)}>
          <p className={cx("title-2 color-1")}>
            {upperFirst(t("dashboard.site.graph1"))}{" "}
          </p>
        </div>
        <div className={cx(styles.overviewTableContainer, "mt-4")}>
          <AllSitesChart entries={filteredEntries} />
        </div>
      </div>
      <div className="mt-5">
        <div className={cx(styles.titleContainer, styles.overviewTableTitle)}>
          <p className={cx("title-2 color-1")}>
            {upperFirst(t("dashboard.site.graph2"))}
          </p>
        </div>
        <div className={cx(styles.overviewTableContainer, "mt-4")}>
          <OverviewTable
            sitesOrProducts={"sites"}
            entries={filteredEntries}
            campaignId={campaignId}
          />
        </div>
      </div>
    </>
  );
};

export default SitesDashboards;
