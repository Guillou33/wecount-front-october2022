import { useSelector, useDispatch } from "react-redux";
import cx from "classnames";
import { RootState } from "@reducers/index";
import { CampaignInformation } from "@reducers/campaignReducer";
import { CampaignTrajectory } from "@reducers/trajectory/campaignTrajectories/campaignTrajectoriesReducer";
import useSetOnceTrajectory from "@hooks/core/reduxSetOnce/useSetOnceTrajectory";
import useCreateTrajectoryIfNeeded from "@hooks/core/reduxSetOnce/useCreateTrajectoryIfNeeded";
import useSetOnceTrajectorySettings from "@hooks/core/reduxSetOnce/useSetOnceTrajectorySettings";

import { Scope } from "@custom-types/wecount-api/activity";
import styles from "@styles/dashboard/campaign/campaignDashboard.module.scss";
import { SelectOne, Option } from "@components/helpers/ui/selects";
import { scopeLabels } from "@components/campaign/detail/trajectory/utils/scopeLabels";
import { setCurrentScope } from "@actions/trajectory/currentTrajectory/currentTrajectoryAction";
import TrajectoryOverviewContainer from "../sub/TrjectoryOverview/TrajectoryOverviewContainer";
import ScopesReductionDashboard from "../sub/ScopesReduction/ScopesReductionDashboard";
import { upperFirst } from "lodash";
import { t } from "i18next";
import useSetOnceCategoryProjectionsView from "@hooks/core/reduxSetOnce/useSetOnceCategoryProjectionsView";

interface Props {
  campaignId: number;
}

const TrajectoryDashboards = ({ campaignId }: Props) => {
  const dispatch = useDispatch();
  const campaignInfo = useSelector<RootState, CampaignInformation | undefined>(
    state => state.campaign.campaigns[campaignId].information
  );
  const targetYear = useSelector<RootState, number | null>(
    state => state.trajectory.trajectorySettings.targetYear
  );

  const trajectoryId = campaignInfo?.campaignTrajectoryIds[0] ?? null;

  useSetOnceTrajectory(trajectoryId);
  useCreateTrajectoryIfNeeded(campaignId);
  useSetOnceTrajectorySettings();
  useSetOnceCategoryProjectionsView(trajectoryId);

  const currentTrajectory = useSelector<RootState, CampaignTrajectory | null>(
    state =>
      trajectoryId ? state.trajectory.campaignTrajectories[trajectoryId] : null
  );

  const selectedScope = useSelector<RootState, Scope>(
    state => state.trajectory.currentTrajectory.currentScope
  );

  return currentTrajectory != null && campaignInfo != null ? (
    <>
      <div className={styles.categoriesDashboardContainer}>
        <div className={styles.titleContainer}>
          <div className={styles.comparisonTitleWrapper}>
            <p className={"title-2 color-1"}>
              {upperFirst(t("dashboard.trajectory.viewByScope"))}
            </p>
          </div>
          <SelectOne
            selected={selectedScope}
            onOptionClick={scope => {
              if (scope != null) {
                dispatch(setCurrentScope(scope));
              }
            }}
          >
            {ctx => (
              <>
                {Object.values(Scope).map(scope => (
                  <Option {...ctx} value={scope} key={scope}>
                    {scopeLabels[scope]}
                  </Option>
                ))}
              </>
            )}
          </SelectOne>
        </div>
        <div className={cx(styles.overviewTableContainer, "mt-4")}>
          <TrajectoryOverviewContainer
            year={campaignInfo.year}
            targetYear={targetYear}
            trajectory={currentTrajectory}
            selectedScope={selectedScope}
          />
        </div>
      </div>
      <div className={styles.categoriesDashboardContainer}>
        <div className={styles.titleContainer}>
          <div className={styles.comparisonTitleWrapper}>
            <p className={"title-2 color-1"}>
              {upperFirst(t("trajectory.definition.macroView"))}
            </p>
          </div>
        </div>
        <div className={cx(styles.overviewTableContainer, "mt-4")}>
          <ScopesReductionDashboard trajectory={currentTrajectory} />
        </div>
      </div>
    </>
  ) : (
    <div className="d-flex mt-5 ml-5 align-items-center">
      <div className="spinner-border text-secondary mr-3"></div>
      <div>{upperFirst(t("global.data.loadingData"))}...</div>
    </div>
  );
};

export default TrajectoryDashboards;
