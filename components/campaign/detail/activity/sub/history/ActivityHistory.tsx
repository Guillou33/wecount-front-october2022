import { upperFirst } from "lodash";
import { t } from "i18next";
import { useSelector } from "react-redux";

import { RootState } from "@reducers/index";
import { EntriesByCampaign } from "@lib/core/activityEntries/getCampaignsEntryInfoByActivityModel";

import memoValue from "@lib/utils/memoValue";
import mapObject from "@lib/utils/mapObject";

import useActivityModelInfo from "@hooks/core/useActivityModelInfo";
import useSetOnceEntriesOfCampaignsAvailableForHistory from "@hooks/core/reduxSetOnce/useSetOnceEntriesOfCampaignsAvailableForHistory";
import useYearSpanOfEntriesByCampaign from "@hooks/core/useYearSpanOfEntriesByCampaign";
import selectAreEntriesOfCampaignsAllFetched from "@selectors/activityEntries/selectAreEntriesOfCampaignsAllFetched";
import selectActivityEntriesOfCampaignIdList from "@selectors/activityEntries/selectActivityEntriesOfCampaignIdList";
import selectCampaignsAvailableForHistoryWithCurrentCampaign from "@selectors/campaign/selectCampaignsAvailableForHistoryWithCurrentCampaign";
import selectFilteredEntriesOfMultipleCampaignsForCartography from "@selectors/activityEntries/selectFilteredEntriesOfMultipleCampaignsForCartography";
import getHistoryFromEntries from "@lib/core/campaignHistory/getHistoryFromEntries";

import HistoryActivityChart from "@components/dashboard/campaign/sub/HistoryChart/HistoryActivityChart";

import styles from "@styles/campaign/detail/activity/sub/history/activityHistory.module.scss";

interface Props {}

const ActivityHistory = ({}: Props) => {
  useSetOnceEntriesOfCampaignsAvailableForHistory();

  const activitymodelInfo = useActivityModelInfo();

  const campaignsAvailableForHistory = useSelector(
    selectCampaignsAvailableForHistoryWithCurrentCampaign
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
  const filteredEntries = useSelector((state: RootState) =>
    selectFilteredEntriesOfMultipleCampaignsForCartography(
      state,
      entriesOfCampaignsAvailableForHistory
    )
  );
  const entriesOfCampaignsAvailableForHistoryAllFetched = useSelector(
    (state: RootState) =>
      selectAreEntriesOfCampaignsAllFetched(
        state,
        idsOfCampaignsAvailableForHistory
      )
  );
  const activityModelId = useSelector<RootState, number | undefined>(
    state => state.activity.edit.activityModelId
  );
  const activityModel =
    activityModelId != null ? activitymodelInfo[activityModelId] : undefined;
  const activityModelName =
    activityModel != null
      ? `${activityModel.category.name} - ${activityModel.name}`
      : undefined;

  const campaignEntriesForCurrentActivityModel = Object.entries(
    filteredEntries
  ).reduce((acc, [campaignId, entries]) => {
    acc[Number(campaignId)] = entries.filter(
      entry => entry.activityModelId === activityModelId
    );
    return acc;
  }, {} as EntriesByCampaign);

  const activityHistory = getHistoryFromEntries(
    campaignEntriesForCurrentActivityModel
  );
  const activityYearSpan = useYearSpanOfEntriesByCampaign(
    entriesOfCampaignsAvailableForHistory
  );

  return activityYearSpan == null ||
    !entriesOfCampaignsAvailableForHistoryAllFetched ? (
    <div className="d-flex ml-5 align-items-center">
      <div className="spinner-border text-secondary mr-3"></div>
      <div>{upperFirst(t("global.data.loadingData"))}...</div>
    </div>
  ) : (
    <div className={styles.activityChartContainer}>
      <HistoryActivityChart
        historyOfEntries={activityHistory}
        yearSpan={activityYearSpan}
        activityModelName={activityModelName}
        campaignTypes={mapObject(
          campaignsAvailableForHistory,
          campaign => campaign.information.type
        )}
      />
    </div>
  );
};

export default ActivityHistory;
