import cx from "classnames";
import { t } from "i18next";
import upperFirst from "lodash/upperFirst";
import { useState } from "react";
import { useSelector } from "react-redux";

import { RootState } from "@reducers/index";

import useFirstActivityModelAvailableId from "@components/dashboard/campaign/dashboardViews/comparisonDashboards/sub/hooks/useFirstActivitymodelAvailable";
import useCategoryInfo from "@hooks/core/useCategoryInfo";
import selectFilteredActivityEntriesForAnalysis from "@selectors/activityEntries/selectFilteredActivityEntriesForAnalysis";
import selectEntryInfoTotal, {
  makeSelectEntryInfoTotal
} from "@selectors/activityEntryInfo/selectEntryInfoTotal";
import selectActivityModelsInCartographyForCampaign from "@selectors/cartography/selectActivityModelsInCartographyForCampaign";
import useComparisonChartTabState from "./sub/hooks/useComparisonChartTabState";

import { convertToTons } from "@lib/utils/calculator";

import ComparisonResults from "@components/dashboard/campaign/dashboardViews/comparisonDashboards/sub/ComparisonResults";
import ActivityModelComparison from "@components/dashboard/campaign/sub/ComparisonCharts/ActivityModelComparison";
import CampaignComparison from "@components/dashboard/campaign/sub/ComparisonCharts/CampaignComparison";
import CategoryComparison from "@components/dashboard/campaign/sub/ComparisonCharts/CategoryComparison";
import EntryComparison from "@components/dashboard/campaign/sub/ComparisonCharts/EntryComparison";
import { Option, SelectOne } from "@components/helpers/ui/selects";

import ActivityMultiSelect from "./sub/ActivityMultiSelect";
import ActivitySelectOne from "./sub/ActivitySelectOne";
import EntryHistoryMultiSelect from "./sub/EntryHistoryMultiSelect";

import useSetAllEntriesForMultipleCampaigns from "@hooks/core/reduxSetOnce/useSetAllEntriesForMultipleCampaigns";
import styles from "@styles/dashboard/campaign/campaignDashboard.module.scss";

const selectEntryInfoTotalForComparison = makeSelectEntryInfoTotal();

interface Props {
  currentCampaignId: number;
}

const ComparisonChartsTab = ({ currentCampaignId }: Props) => {
  const categoryInfo = useCategoryInfo();
  const activityModelsInCartography = useSelector((state: RootState) =>
    selectActivityModelsInCartographyForCampaign(state, currentCampaignId)
  );

  const currentCampaign = useSelector(
    (state: RootState) => state.campaign.campaigns[currentCampaignId]
  );

  const allCampaigns = useSelector(
    (state: RootState) => state.campaign.campaigns
  );
  const otherCampaignIds = Object.keys(allCampaigns)
    .map(campaignId => Number(campaignId))
    .filter(campaignId => campaignId !== currentCampaignId);

  const defaultcampaignIdToCompare = otherCampaignIds[0] ?? -1;

  const defaultActivityModelId = useFirstActivityModelAvailableId(currentCampaignId);

  const [state, setCampaignToCompareId, setActivityModelId, toggleHistoryCode] =
    useComparisonChartTabState(
      defaultcampaignIdToCompare,
      defaultActivityModelId
    );
  const {
    campaignToCompareId,
    userSelectionOfEntryComparison: {
      activityModelId,
      excludedEntryHistoryCodes,
    },
  } = state;

  const campaignToCompare = useSelector(
    (state: RootState) => state.campaign.campaigns[campaignToCompareId]
  );

  const mainCampaignEntries = useSelector((state: RootState) =>
    selectFilteredActivityEntriesForAnalysis(state, currentCampaignId)
  );
  const comparisonCampaignEntries = useSelector((state: RootState) =>
    selectFilteredActivityEntriesForAnalysis(state, campaignToCompareId)
  );

  const { tCo2: mainCampaignTotalTco2 } = useSelector((state: RootState) =>
    selectEntryInfoTotal(state, mainCampaignEntries)
  );
  const { tCo2: compareToCampaignTotalTco2 } = useSelector((state: RootState) =>
    selectEntryInfoTotalForComparison(state, comparisonCampaignEntries)
  );

  const campaignIdToFetch =
    campaignToCompareId !== -1 ? campaignToCompareId : null;
  if (campaignIdToFetch !== null) {
    useSetAllEntriesForMultipleCampaigns([currentCampaignId, campaignIdToFetch]);
  }

  const [selectedActivityModelIds, setSelectedActivityModelIds] = useState(
    activityModelsInCartography.map(am => am.id)
  );

  const yearOfCurrentCampaign = currentCampaign?.information?.year ?? -Infinity;
  const yearOfCampaignToCompare =
    campaignToCompare?.information?.year ?? Infinity;
  const isChronological = yearOfCurrentCampaign < yearOfCampaignToCompare;
  const [campaignOne, campaignTwo] = isChronological
    ? [currentCampaignId, campaignToCompareId]
    : [campaignToCompareId, currentCampaignId];

  return (
    <>
      <div className={styles.historyListCampaignSelection}>
        {upperFirst(t("global.compare"))} {currentCampaign?.information?.name}{" "}
        {t("global.other.with")} :
        <SelectOne
          selected={campaignToCompareId}
          onOptionClick={setCampaignToCompareId}
          className={styles.campaignSelector}
        >
          {ctx => (
            <>
              {otherCampaignIds.map(campaignId => (
                <Option {...ctx} value={campaignId} key={campaignId}>
                  {allCampaigns[campaignId]?.information?.name}
                </Option>
              ))}
              {otherCampaignIds.length === 0 && (
                <div className={styles.noComparisonAvailable}>
                  {upperFirst(t("campaign.noOtherCampaignToCompare"))}
                </div>
              )}
            </>
          )}
        </SelectOne>
      </div>
      <div className={cx(styles.categoriesDashboardContainer, styles.first)}>
        <div className={cx(styles.titleContainer)}>
          <div className={styles.results}>
            <p className="title-3 color-2 text-right">
              {currentCampaign?.information?.name} :{" "}
              <span className="title-2 color-1">
                {convertToTons(mainCampaignTotalTco2)}{" "}
                {t("footprint.emission.tco2.tco2e")}
              </span>
            </p>
            {campaignToCompare != null && (
              <ComparisonResults
                compareToCampaign={campaignToCompare}
                compareToCampaignTotalTco2={compareToCampaignTotalTco2}
              />
            )}
          </div>
        </div>
        <div className={cx(styles.barContainer, "mt-4")}>
          <CampaignComparison
            categoryInfo={categoryInfo}
            resultTco2Total={mainCampaignTotalTco2}
            campaignToCompareId={campaignToCompareId}
            campaignToCompareResultTco2={compareToCampaignTotalTco2}
            mainCampaignEntries={mainCampaignEntries}
            compareToCAmpaignEntries={comparisonCampaignEntries}
          />
        </div>
      </div>
      <div className={cx(styles.categoriesDashboardContainer)}>
        <div className={cx(styles.topBar, "mb-0")}>
          <p className="title-2 color-1 mb-0">
            {upperFirst(t("dashboard.categoryComparisonChart.title"))}
          </p>
        </div>
        <CategoryComparison
          campaignId={campaignOne}
          campaignToCompareId={campaignTwo}
        />
      </div>
      <div className={cx(styles.categoriesDashboardContainer)}>
        <div className={styles.topBar}>
          <p className="title-2 color-1 mb-0">
            {upperFirst(t("dashboard.activityComparisonChart.title"))}
          </p>
          <ActivityMultiSelect
            campaignId={currentCampaignId}
            selectedActivityModels={selectedActivityModelIds}
            onChange={setSelectedActivityModelIds}
          />
        </div>
        <ActivityModelComparison
          campaignId={campaignOne}
          campaignToCompareId={campaignTwo}
          activityModelIds={selectedActivityModelIds}
        />
      </div>
      <div className={cx(styles.categoriesDashboardContainer)}>
        <div className={styles.topBar}>
          <p className="title-2 color-1 mb-0">
            {upperFirst(t("dashboard.entryComparisonChart.title"))}
          </p>
        </div>
        <div className={styles.selectionContainer}>
          <ActivitySelectOne
            campaignId={campaignOne}
            campaignToCompareId={campaignTwo}
            selectedActivityModel={activityModelId}
            onChange={setActivityModelId}
          />
          <EntryHistoryMultiSelect
            campaignId={campaignOne}
            campaignToCompareId={campaignTwo}
            excludedEntryHistory={excludedEntryHistoryCodes}
            selectedActivityModelId={activityModelId}
            onOptionClick={toggleHistoryCode}
          />
        </div>
        <EntryComparison
          campaignId={campaignOne}
          campaignToCompareId={campaignTwo}
          selectedActivityModelId={activityModelId}
          excludedEntryHistory={excludedEntryHistoryCodes}
        />
      </div>
    </>
  );
};

export default ComparisonChartsTab;
