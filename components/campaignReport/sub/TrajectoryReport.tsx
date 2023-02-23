import { useSelector } from "react-redux";
import { Fragment } from "react";

import { RootState } from "@reducers/index";
import { CampaignInformation } from "@reducers/campaignReducer";
import { CampaignTrajectory } from "@reducers/trajectory/campaignTrajectories/campaignTrajectoriesReducer";
import { Scope } from "@custom-types/wecount-api/activity";
import { TrajectorySettings } from "@reducers/trajectory/trajectorySettings/trajectorySettingsReducer";

import useReductionInfoByScope from "@hooks/core/useReductionInfoByScope";
import useAllEntriesInfoByScope from "@hooks/core/activityEntryInfo/useAllEntriesInfoByScope";
import { convertToTons } from "@lib/utils/calculator";

import ReductionBadge from "@components/campaign/detail/trajectory/helpers/ReductionBadge";
import ReportLink from "@components/campaignReport/sub/ReportLink";

import styles from "@styles/campaignReports/sub/trajectoryReport.module.scss";
import { upperFirst } from "lodash";
import { t } from "i18next";
import { formatNumberWithLanguage } from "@lib/translation/config/numbers";
import { reformatConvertToTons } from "@lib/core/campaign/getEmissionNumbers";

const scopeLabels = {
  [Scope.UPSTREAM]: upperFirst(t("footprint.scope.upstream")),
  [Scope.CORE]: upperFirst(t("footprint.scope.core")),
  [Scope.DOWNSTREAM]: upperFirst(t("footprint.scope.downstream")),
};

interface Props {
  trajectory: CampaignTrajectory;
}

const TrajectoryReport = ({ trajectory }: Props) => {
  const campaignInfo = useSelector<RootState, CampaignInformation | undefined>(
    state => state.campaign.campaigns[trajectory.campaignId].information
  );
  const trajectorySettings = useSelector<RootState, TrajectorySettings>(
    state => state.trajectory.trajectorySettings
  );

  const reductionInfoByScope = useReductionInfoByScope(trajectory.id);
  const entryInfoByScope = useAllEntriesInfoByScope(trajectory.campaignId);

  const scopes = [Scope.UPSTREAM, Scope.CORE, Scope.DOWNSTREAM];

  const hasTarget =
    trajectorySettings.scopeTargets[Scope.UPSTREAM].target != null ||
    trajectorySettings.scopeTargets[Scope.CORE].target != null ||
    trajectorySettings.scopeTargets[Scope.DOWNSTREAM].target != null;

  return (
    <>
      <div className={styles.trajectoryReport}>
        {scopes.map(scope => {
          const scopeTarget = trajectorySettings.scopeTargets[scope];
          const year = campaignInfo?.year;
          const targetYear = trajectorySettings?.targetYear;
          const yearRange =
            year != null && targetYear != null
              ? targetYear - year
              : 0;
          const computedTarget = yearRange * (scopeTarget.target ?? 0);
          return (
            <Fragment key={scope}>
              <div className={styles.scopeLabel}>
                <div>{scopeLabels[scope]}</div>
                <div>{reformatConvertToTons(entryInfoByScope[scope].tCo2)}t</div>
              </div>
              <div className={styles.reportLabel}>{t("trajectory.definition.reductionTarget")}</div>
              <ReductionBadge value={computedTarget} className={styles.badge} />
              <div className={styles.reportLabel}>{t("trajectory.reduction.estimatedReduction")}</div>
              <ReductionBadge
                className={styles.badge}
                value={reductionInfoByScope[scope].reductionPercentageOfScope}
                type="light"
              />
            </Fragment>
          );
        })}
      </div>
      <ReportLink href={`/trajectories/${trajectory.campaignId}`}>
        {hasTarget ? undefined : upperFirst(t("global.beginPrompt"))}
      </ReportLink>
    </>
  );
};

export default TrajectoryReport;
