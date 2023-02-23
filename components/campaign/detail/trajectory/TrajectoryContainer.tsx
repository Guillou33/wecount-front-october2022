import { useSelector, useDispatch } from "react-redux";
import styles from "@styles/core/header.module.scss";
import cx from 'classnames';
import { RootState } from "@reducers/index";
import { CampaignTrajectory } from "@reducers/trajectory/campaignTrajectories/campaignTrajectoriesReducer";
import useSetOnceActivityModelsVisibilities from "@hooks/core/reduxSetOnce/useSetOnceActivityModelVisibilities";
import useCreateTrajectoryIfNeeded from "@hooks/core/reduxSetOnce/useCreateTrajectoryIfNeeded";
import useSetOnceTrajectory from "@hooks/core/reduxSetOnce/useSetOnceTrajectory";
import useFirstTrajectory from "@hooks/core/useFirstTrajectory";
import useSetOnceScopeHelps from "@hooks/core/reduxSetOnce/useSetOnceScopeHelps";
import TrajectoryProjection from "@components/campaign/detail/trajectory/TrajectoryProjection";
import AuthLayout from "@components/layout/AuthLayout";
import { Scope } from "@custom-types/wecount-api/activity";
import { scopeLabels } from "@components/campaign/detail/trajectory/utils/scopeLabels";
import { setCurrentScope } from "@actions/trajectory/currentTrajectory/currentTrajectoryAction";
import { Campaign as CampaignType } from "@reducers/campaignReducer";
import { TrajectorySettings } from "@reducers/trajectory/trajectorySettings/trajectorySettingsReducer";
import useSetOnceTrajectorySettings from "@hooks/core/reduxSetOnce/useSetOnceTrajectorySettings";

import MainHeader from "@components/core/MainHeader";

import useSetAllEntries from "@hooks/core/reduxSetOnce/useSetAllEntries";
import { TrajectoryViewItem } from "./helpers/TrajectoryTabItems";
import TrajectoryDefinition from "./TrajectoryDefinition";
import Tabs from "@components/helpers/ui/Tabs";
import { upperFirst } from "lodash";
import { t } from "i18next";

interface Props {
  campaignId: number;
}

const TrajectoryContainer = ({ campaignId }: Props) => {
  const dispatch = useDispatch();
  const currentTrajectoryId = useFirstTrajectory(campaignId);

  useSetAllEntries(campaignId);
  useSetOnceActivityModelsVisibilities();
  useCreateTrajectoryIfNeeded(campaignId);
  useSetOnceTrajectory(currentTrajectoryId);
  useSetOnceTrajectorySettings();
  useSetOnceScopeHelps();

  const currentTrajectory = useSelector<RootState, CampaignTrajectory | null>(
    state =>
      currentTrajectoryId
        ? state.trajectory.campaignTrajectories[currentTrajectoryId]
        : null
  );
  const campaign = useSelector<RootState, CampaignType>(
    state => state.campaign.campaigns[campaignId]
  );

  const trajectorySettings = useSelector<RootState, TrajectorySettings>(
    state => state.trajectory.trajectorySettings
  );

  const selectedTrajectoryView = useSelector<RootState, TrajectoryViewItem>(
    state => state.trajectory.currentTrajectory.currentTrajectoryView
  );

  const selectedScope = useSelector<RootState, Scope>(
    state => state.trajectory.currentTrajectory.currentScope
  );

  const availableTabs = Object.values(Scope).map(scope => ({
    label: scopeLabels[scope],
    value: scope,
  }));

  const renderTrajectoryDefinition = () => {
    return currentTrajectory != null && trajectorySettings.isFetched ? (
      <TrajectoryDefinition
        trajectory={currentTrajectory}
        trajectorySettings={trajectorySettings}
        campaign={campaign}
      />
    ) : (
      <div className="d-flex mt-5 ml-5 align-items-center">
        <div className="spinner-border text-secondary mr-3"></div>
        <div>{upperFirst(t("global.data.loadingData"))}...</div>
      </div>
    )
  };

  const renderTrajectoryProjection = () => {
    return currentTrajectory != null && trajectorySettings.isFetched ? (
      <>
        <TrajectoryProjection
          trajectory={currentTrajectory}
          trajectorySettings={trajectorySettings}
          availableTabs={availableTabs}
        />
      </>
    ) : (
      <div className="d-flex mt-5 ml-5 align-items-center">
        <div className="spinner-border text-secondary mr-3"></div>
        <div>{upperFirst(t("global.data.loadingData"))}...</div>
      </div>
    )
  };

  return (
    <AuthLayout>
      <MainHeader
        title={upperFirst(t("trajectory.trajectory"))}
        menu={"trajectories"}
        campaign={campaign}
        availableTabs={availableTabs}
        currentView={selectedScope}
        onChange={scope => dispatch(setCurrentScope(scope))}
        currentTrajectory={currentTrajectory}
      />
      <div className="page-content-wrapper">
        {selectedTrajectoryView === TrajectoryViewItem.PROJECTION ? (
          <div className={cx(styles.tabsContainer, styles.tabsProjectionView)}>
            <Tabs
              className={styles.campaignTabs}
              tabItems={availableTabs}
              value={selectedScope}
              onChange={scope => dispatch(setCurrentScope(scope))}
            />
          </div>
        ) : (
          <></>
        )}
        <div className="page-content">
          {selectedTrajectoryView === TrajectoryViewItem.DEFINITION ? (
            renderTrajectoryDefinition()
          ) : renderTrajectoryProjection()}
        </div>
      </div>
    </AuthLayout>
  );
};

export default TrajectoryContainer;
