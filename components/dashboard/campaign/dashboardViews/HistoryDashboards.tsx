import cx from "classnames";
import { useDispatch, useSelector } from "react-redux";

import mapObject from "@lib/utils/mapObject";
import memoValue from "@lib/utils/memoValue";

import { CampaignType } from "@custom-types/core/CampaignType";
import { Scope } from "@custom-types/wecount-api/activity";
import { RootState } from "@reducers/index";

import HistoryScopeChart from "@components/dashboard/campaign/sub/HistoryChart/HistoryScopeChart";
import HistoryTotalChart from "@components/dashboard/campaign/sub/HistoryChart/HistoryTotalChart";

import useCreateTrajectoryIfNeeded from "@hooks/core/reduxSetOnce/useCreateTrajectoryIfNeeded";
import useSetOnceCategoryProjectionsView from "@hooks/core/reduxSetOnce/useSetOnceCategoryProjectionsView";
import useSetOnceEntriesOfCampaignsAvailableForHistory from "@hooks/core/reduxSetOnce/useSetOnceEntriesOfCampaignsAvailableForHistory";
import useSetOnceTrajectory from "@hooks/core/reduxSetOnce/useSetOnceTrajectory";
import useSetOnceTrajectorySettings from "@hooks/core/reduxSetOnce/useSetOnceTrajectorySettings";
import useYearSpanOfEntriesByCampaign from "@hooks/core/useYearSpanOfEntriesByCampaign";
import selectActivityEntriesOfCampaignIdList from "@selectors/activityEntries/selectActivityEntriesOfCampaignIdList";
import selectAreEntriesOfCampaignsAllFetched from "@selectors/activityEntries/selectAreEntriesOfCampaignsAllFetched";
import selectFilteredEntriesOfMultipleCampaigns from "@selectors/activityEntries/selectFilteredEntriesOfMultipleCampaignsForAnalysis";
import selectCampaignsAvailableForHistory from "@selectors/campaign/selectCampaignsAvailableForHistory";

import { keepOnlyEntriesForCampaign } from "@actions/entries/campaignEntriesAction";
import styles from "@styles/dashboard/campaign/campaignDashboard.module.scss";
import { t } from "i18next";
import { upperFirst } from "lodash";
import { useEffect } from "react";

interface Props {
  campaignId: number;
}

const Historydashboards = ({ campaignId }: Props) => {
  const dispatch = useDispatch();
  
  useSetOnceEntriesOfCampaignsAvailableForHistory();
  useSetOnceTrajectorySettings();

  useEffect(() => {
    return () => {
      dispatch(keepOnlyEntriesForCampaign({campaignId}));
    };
  }, []);

  const currentCampaignType = useSelector(
    (state: RootState) =>
      state.campaign.campaigns[campaignId]?.information?.type
  );

  const campaignsAvailableForHistory = useSelector(
    selectCampaignsAvailableForHistory
  );
  const idsOfCampaignsAvailableForHistory = memoValue(
    Object.keys(campaignsAvailableForHistory).map(key => Number(key))
  );
  const entriesOfCampaignsAvailableForHistory = useSelector(
    (state: RootState) =>
      selectActivityEntriesOfCampaignIdList(
        state,
        idsOfCampaignsAvailableForHistory
      )
  );
  const entriesOfCampaignsAvailableForHistoryAllFetched = useSelector(
    (state: RootState) =>
      selectAreEntriesOfCampaignsAllFetched(
        state,
        idsOfCampaignsAvailableForHistory
      )
  );

  const campaignTypes = mapObject(
    campaignsAvailableForHistory,
    campaign => campaign.information.type
  );

  const filteredEntriesByCampaign = useSelector((state: RootState) =>
    selectFilteredEntriesOfMultipleCampaigns(
      state,
      entriesOfCampaignsAvailableForHistory
    )
  );
  const yearSpan = useYearSpanOfEntriesByCampaign(filteredEntriesByCampaign);

  const campaignOfReferenceId = yearSpan?.campaignIdsByYear[yearSpan?.start];
  const trajectoryOfReferenceId = useSelector((state: RootState) =>
    campaignOfReferenceId != null
      ? state.campaign.campaigns[campaignOfReferenceId]?.information
          ?.campaignTrajectoryIds[0] ?? null
      : null
  );
  useSetOnceTrajectory(trajectoryOfReferenceId);
  useCreateTrajectoryIfNeeded(campaignOfReferenceId);
  useSetOnceCategoryProjectionsView(trajectoryOfReferenceId);

  const trajectoryOfReference = useSelector((state: RootState) => {
    return trajectoryOfReferenceId != null
      ? state.trajectory.campaignTrajectories[trajectoryOfReferenceId] ?? null
      : null;
  });

  const trajectorySettings = useSelector(
    (state: RootState) => state.trajectory.trajectorySettings
  );

  return trajectoryOfReference == null ||
    yearSpan == null ||
    !entriesOfCampaignsAvailableForHistoryAllFetched ? (
    <div className="d-flex ml-5 align-items-center">
      <div className="spinner-border text-secondary mr-3"></div>
      <div>{upperFirst(t("global.data.loadingData"))}...</div>
    </div>
  ) : (
    <>
      {currentCampaignType === CampaignType.DRAFT && (
        <div className="alert alert-warning mt-4 mb-0">
          {upperFirst(t("dashboard.evolutionExplanation"))}
        </div>
      )}
      <div
        className={cx(
          styles.categoriesDashboardContainer,
          styles.dynamicHeight,
          {
            [styles.warningPresent]:
              currentCampaignType === CampaignType.DRAFT,
          }
        )}
      >
        <HistoryTotalChart
          entriesByCampaign={filteredEntriesByCampaign}
          trajectorySettings={trajectorySettings}
          trajectoryOfReference={trajectoryOfReference}
          yearSpan={yearSpan}
          campaignTypes={campaignTypes}
        />
      </div>
      <div
        className={cx(
          styles.categoriesDashboardContainer,
          styles.dynamicHeight
        )}
      >
        <HistoryScopeChart
          entriesByCampaign={filteredEntriesByCampaign}
          trajectorySettings={trajectorySettings}
          trajectoryOfReference={trajectoryOfReference}
          yearSpan={yearSpan}
          scope={Scope.UPSTREAM}
          campaignTypes={campaignTypes}
        />
      </div>
      <div
        className={cx(
          styles.categoriesDashboardContainer,
          styles.dynamicHeight
        )}
      >
        <HistoryScopeChart
          entriesByCampaign={filteredEntriesByCampaign}
          trajectorySettings={trajectorySettings}
          trajectoryOfReference={trajectoryOfReference}
          yearSpan={yearSpan}
          scope={Scope.CORE}
          campaignTypes={campaignTypes}
        />
      </div>
      <div
        className={cx(
          styles.categoriesDashboardContainer,
          styles.dynamicHeight
        )}
      >
        <HistoryScopeChart
          entriesByCampaign={filteredEntriesByCampaign}
          trajectorySettings={trajectorySettings}
          trajectoryOfReference={trajectoryOfReference}
          yearSpan={yearSpan}
          scope={Scope.DOWNSTREAM}
          campaignTypes={campaignTypes}
        />
      </div>
    </>
  );
};

export default Historydashboards;
