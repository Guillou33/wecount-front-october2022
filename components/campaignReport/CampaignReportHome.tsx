import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import cx from "classnames";

import { RootState } from "@reducers/index";
import { Campaign } from "@reducers/campaignReducer";
import { CampaignIndicators } from "@reducers/indicator/indicatorReducer";
import { CampaignTrajectory } from "@reducers/trajectory/campaignTrajectories/campaignTrajectoriesReducer";

import useCreateDefaultIndicators from "@hooks/core/reduxSetOnce/useCreateDefaultIndicators";
import useSetOnceCampaignIndicators from "@hooks/core/reduxSetOnce/useSetOnceCampaignIndicators";
import useFirstTrajectory from "@hooks/core/useFirstTrajectory";
import useCreateTrajectoryIfNeeded from "@hooks/core/reduxSetOnce/useCreateTrajectoryIfNeeded";
import useSetOnceTrajectory from "@hooks/core/reduxSetOnce/useSetOnceTrajectory";
import useSetOnceTrajectorySettings from "@hooks/core/reduxSetOnce/useSetOnceTrajectorySettings";
import useAllEntriesInfoTotal from "@hooks/core/activityEntryInfo/useAllEntriesInfoTotal";
import { convertToTons } from "@lib/utils/calculator";

import AuthLayout from "@components/layout/AuthLayout";
import ScopeChart from "@components/campaignReport/sub/ScopeChart";
import TrajectoryReport from "@components/campaignReport/sub/TrajectoryReport";
import ProgressReport from "@components/campaignReport/sub/ProgressReport";
import SiteOrProductReport from "@components/campaignReport/sub/SiteOrProductReport";
import ReportLink from "@components/campaignReport/sub/ReportLink";

import styles from "@styles/campaignReports/campaignReportHome.module.scss";
import { t } from "i18next";
import { upperFirst } from "lodash";
import { formatNumberWithLanguage } from "@lib/translation/config/numbers";
import { reformatConvertToTons } from "@lib/core/campaign/getEmissionNumbers";

const CampaignReportHome = () => {
  const router = useRouter();
  const campaignId = Number(router.query.campaignId! as string);

  useSetOnceCampaignIndicators(campaignId);
  useCreateDefaultIndicators(campaignId);

  const currentTrajectoryId = useFirstTrajectory(campaignId);
  useCreateTrajectoryIfNeeded(campaignId);
  useSetOnceTrajectory(currentTrajectoryId);
  useSetOnceTrajectorySettings();
  const trajectory = useSelector<RootState, CampaignTrajectory | null>(state =>
    currentTrajectoryId
      ? state.trajectory.campaignTrajectories[currentTrajectoryId]
      : null
  );

  const campaign = useSelector<RootState, Campaign | undefined>(state =>
    campaignId != null ? state.campaign.campaigns[campaignId] : undefined
  );
  const campaignIndicators = useSelector<RootState, CampaignIndicators | null>(
    state => (campaignId != null ? state.indicator[campaignId] : null)
  );

  const tco2Total = useAllEntriesInfoTotal(campaignId).tCo2;

  const firstTwoIndicators = Object.values(
    campaignIndicators?.indicators ?? {}
  ).slice(0, 2);

  return (
    <AuthLayout>
      {campaign?.information != null && trajectory != null ? (
        <div className="page-content-wrapper">
          <div className="page-content">
            <div className={styles.reportHeader}>
              <div className={styles.titleContainer}>
                <h2 className="title-1 color-1 mb-0">
                  {campaign.information.name}
                </h2>
                <div>
                  <div className={styles.yearContainer}>
                    <img
                      src="/icons/icon-calendar.svg"
                      className={styles.icon}
                    />
                    {upperFirst(t("campaign.referenceYear"))} :
                    <span className={styles.year}>
                      {campaign.information.year ?? "n/a"}
                    </span>
                  </div>
                  <div className={styles.yearContainer}>
                    <img src="/icons/icon-target.svg" className={styles.icon} />
                      {upperFirst(t("campaign.targetYear"))} :
                    <span className={styles.year}>
                      {campaign.information.targetYear ?? "n/a"}
                    </span>
                  </div>
                </div>
              </div>
              <div className={styles.badgeContainer}>
                <div className={styles.badge}>
                  <div className={styles.badgeTitle}>{upperFirst(t("global.common.total"))}</div>
                  <div>{reformatConvertToTons(tco2Total)} {t("footprint.emission.tco2.tco2e")}</div>
                </div>
                {firstTwoIndicators.map(indicator => {
                  return (
                    <div className={styles.badge} key={indicator.id}>
                      <div className={styles.badgeTitle}>
                        {t("footprint.emission.tco2.tco2e")}/{indicator.unit}
                      </div>
                      <div>
                        {reformatConvertToTons(tco2Total / (indicator.quantity ?? 1))}{" "}
                        {t("footprint.emission.tco2.tco2e")}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={styles.chartGrid}>
              <div className={cx(styles.container, styles.siteProductChart)}>
                <SiteOrProductReport campaignId={campaignId} />
              </div>
              <div className={styles.container}>
                <ScopeChart campaignId={campaignId} />
              </div>
              <div className={styles.container}>
                <TrajectoryReport trajectory={trajectory} />
              </div>
            </div>
            {tco2Total > 0 && (
              <div
                className={cx(styles.container, styles.dataProgressContainer)}
              >
                <ProgressReport campaignId={campaignId} />
                <ReportLink href={`/campaigns/${campaignId}`} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.spinnerContainer}>
          <div className={cx("spinner-border", styles.spinner)}></div>
          <div>{upperFirst(t("global.data.loadingData"))}...</div>
        </div>
      )}
    </AuthLayout>
  );
};

export default CampaignReportHome;
