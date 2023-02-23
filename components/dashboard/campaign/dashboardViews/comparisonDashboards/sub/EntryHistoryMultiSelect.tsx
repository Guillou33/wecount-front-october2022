import upperFirst from "lodash/upperFirst";
import { t } from "i18next";
import { useSelector } from "react-redux";

import { RootState } from "@reducers/index";

import selectActivityEntriesOfCampaignIdList from "@selectors/activityEntries/selectActivityEntriesOfCampaignIdList";
import selectFilteredEntriesOfMultipleCampaignsForAnalysis from "@selectors/activityEntries/selectFilteredEntriesOfMultipleCampaignsForAnalysis";

import memoValue from "@lib/utils/memoValue";
import getHistoryFromEntries from "@lib/core/campaignHistory/getHistoryFromEntries";

import { MultiSelect, CheckboxOption } from "@components/helpers/ui/selects";

import styles from "@styles/dashboard/campaign/dashboardViews/comparisonDashboards/sub/entryHistoryMultiSelect.module.scss";

interface Props {
  campaignId: number;
  campaignToCompareId: number;
  selectedActivityModelId: number;
  excludedEntryHistory: Record<string, true>;
  onOptionClick: (entryHistoryCode: string) => void;
}

const EntryHistoryMultiSelect = ({
  campaignId,
  campaignToCompareId,
  selectedActivityModelId,
  excludedEntryHistory,
  onOptionClick,
}: Props) => {
  const campaignIdList = memoValue([campaignId, campaignToCompareId]);

  const entriesOfCampaigns = useSelector((state: RootState) =>
    selectActivityEntriesOfCampaignIdList(state, campaignIdList)
  );

  const filteredEntriesOfCampaigns = useSelector((state: RootState) =>
    selectFilteredEntriesOfMultipleCampaignsForAnalysis(
      state,
      entriesOfCampaigns
    )
  );
  const comparisonHistory = getHistoryFromEntries(filteredEntriesOfCampaigns);

  const historyCodes = Object.keys(comparisonHistory).filter(
    historyCode =>
      comparisonHistory[historyCode].entriesBycampaignId[campaignId]
        ?.activityModelId === selectedActivityModelId ||
      comparisonHistory[historyCode].entriesBycampaignId[campaignToCompareId]
        ?.activityModelId === selectedActivityModelId
  );
  const selectedHistoryCodes = historyCodes.filter(
    historyCode => !excludedEntryHistory[historyCode]
  );

  function getEfName(historyCode: string): string {
    return (
      comparisonHistory[historyCode]?.entriesBycampaignId[campaignId]
        ?.emissionFactor?.name ??
      comparisonHistory[historyCode]?.entriesBycampaignId[campaignToCompareId]
        ?.emissionFactor?.name ??
      "saisie manuelle"
    );
  }

  return (
    <div className={styles.entryHistoryMultiSelectContainer}>
      {upperFirst(t("entry.activityEntryData", { count: 2 }))}
      <MultiSelect
        selected={selectedHistoryCodes}
        onOptionClick={onOptionClick}
        className={styles.entryHistoryMultiSelect}
        alignment="right"
      >
        {ctx => (
          <>
            {historyCodes.map(historyCode => (
              <CheckboxOption {...ctx} key={historyCode} value={historyCode}>
                <>
                  {historyCode} : {getEfName(historyCode)}
                </>
              </CheckboxOption>
            ))}
            {historyCodes.length === 0 && (
              <div className={styles.noData}>
                {upperFirst(t("dashboard.entryComparisonChart.noHistoryData"))}
              </div>
            )}
          </>
        )}
      </MultiSelect>
    </div>
  );
};

export default EntryHistoryMultiSelect;
