import { useSelector } from "react-redux";

import cx from "classnames";
import OverviewTable from "@components/dashboard/campaign/sub/OverviewTable";
import ProductsKpiTable from "@components/dashboard/campaign/sub/ProductsKpiTable";
import styles from "@styles/dashboard/campaign/campaignDashboard.module.scss";
import { RootState } from "@reducers/index";
import ChartByProducts from "@components/dashboard/campaign/sub/ChartByProducts";

import selectFilteredActivityEntriesForAnalysis from "@selectors/activityEntries/selectFilteredActivityEntriesForAnalysis";
import { t } from "i18next";
import { upperFirst } from "lodash";

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
          {upperFirst(t("product.info"))} <b>{t("product.products")}</b>
        </p>
      </div>
      <div className={styles.categoriesDashboardContainer}>
        <div className={cx(styles.titleContainer, styles.overviewTableTitle)}>
          <p className={cx("title-2 color-1")}>
            {upperFirst(t("dashboard.product.graph1"))}
          </p>
        </div>
        <div className={cx(styles.overviewTableContainer, "mt-4")}>
          <ChartByProducts campaignId={campaignId} entries={filteredEntries} />
        </div>
      </div>
      <div className="mt-5">
        <div className={cx(styles.titleContainer, styles.overviewTableTitle)}>
          <p className={cx("title-2 color-1")}>
            {upperFirst(t("dashboard.product.graph2"))}       
          </p>
        </div>
        <ProductsKpiTable campaignId={campaignId} entries={filteredEntries} />
      </div>
      <div className="mt-5">
        <div className={cx(styles.titleContainer, styles.overviewTableTitle)}>
          <p className={cx("title-2 color-1")}>
            {upperFirst(t("dashboard.product.graph3"))}   
          </p>
        </div>
        <div className={cx(styles.overviewTableContainer, "mt-4")}>
          <OverviewTable
            sitesOrProducts={"products"}
            entries={filteredEntries}
            campaignId={campaignId}
          />
        </div>
      </div>
    </>
  );
};

export default SitesDashboards;
