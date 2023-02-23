import cx from "classnames";
import { useState } from "react";
import { useSelector } from "react-redux";

import { CampaignType } from "@custom-types/core/CampaignType";
import { CampaignInformation } from "@reducers/campaignReducer";
import { RootState } from "@reducers/index";

import useSetAllEntries from "@hooks/core/reduxSetOnce/useSetAllEntries";

import selectCampaignsAvailableForHistory from "@selectors/campaign/selectCampaignsAvailableForHistory";
import selectSimulationOfCampaign from "@selectors/campaign/selectSimulationOfCampaign";

import HistoryTable from "@components/dashboard/campaign/sub/HistoryTable/HistoryTable";
import SearchInput from "@components/helpers/form/field/SearchInput";
import { Option, SelectOne } from "@components/helpers/ui/selects";

import styles from "@styles/dashboard/campaign/campaignDashboard.module.scss";
import { upperFirst } from "lodash";

import { t } from "i18next";

interface Props {
  campaignId: number;
  campaignInformation: CampaignInformation | undefined;
}

const HistoryTableTab = ({ campaignId, campaignInformation }: Props) => {
  const simulationOfCampaign = useSelector((state: RootState) =>
    selectSimulationOfCampaign(state, campaignId)
  );

  const campaignsAvailableForHistory = useSelector(
    selectCampaignsAvailableForHistory
  );
  const otherCampaignsAvailableForHistoryList = Object.values(
    campaignsAvailableForHistory
  ).filter(campaign => campaign?.information?.id !== campaignId);
  if (simulationOfCampaign != null) {
    otherCampaignsAvailableForHistoryList.push(simulationOfCampaign);
  }
  otherCampaignsAvailableForHistoryList.sort(
    (campaignA, campaignB) =>
      (campaignA.information?.year ?? 0) - (campaignB.information?.year ?? 0)
  );

  const defaultCampaign2 = otherCampaignsAvailableForHistoryList[0];
  const [campaignIdToCompare, setCampaignIdToCompare] = useState(
    defaultCampaign2?.information?.id ?? null
  );
  useSetAllEntries(campaignIdToCompare);

  const yearOfCurrentCampaign = campaignInformation?.year ?? -Infinity;
  const yearOfCampaignToCompare =
    campaignsAvailableForHistory[campaignIdToCompare ?? -1]?.information
      ?.year ?? Infinity;
  const isChronological = yearOfCurrentCampaign < yearOfCampaignToCompare;

  const [campaignId1, campaignId2] = isChronological
    ? [campaignId, campaignIdToCompare]
    : [campaignIdToCompare, campaignId];

  const [historySearch, setHistorySearch] = useState("");

  return campaignInformation?.type === CampaignType.CARBON_FOOTPRINT ||
    campaignInformation?.type === CampaignType.SIMULATION ? (
    <>
      <div className={styles.historyListCampaignSelection}>
        {upperFirst(t("global.compare"))}{" "}
        {campaignInformation?.type === CampaignType.SIMULATION
          ? t("footprint.simulationOfYear", { year: campaignInformation?.year })
          : campaignInformation?.year}{" "}
        {t("global.other.with")} :
        <SelectOne
          selected={campaignIdToCompare}
          onOptionClick={setCampaignIdToCompare}
          className={styles.campaignSelector}
        >
          {ctx => (
            <>
              {otherCampaignsAvailableForHistoryList.map(campaign => {
                const isSameYear =
                  campaign?.information?.year ===
                  simulationOfCampaign?.information.year;
                return (
                  <Option
                    {...ctx}
                    value={campaign?.information?.id ?? -1}
                    key={campaign?.information?.id ?? -1}
                  >
                    {isSameYear &&
                    campaign.information?.type === CampaignType.SIMULATION
                      ? upperFirst(
                          t("footprint.simulationOfYear", {
                            year: campaign?.information?.year,
                          })
                        )
                      : campaign?.information?.year}
                  </Option>
                );
              })}
              {otherCampaignsAvailableForHistoryList.length === 0 && (
                <div className={styles.noComparisonAvailable}>
                  {upperFirst(t("campaign.noOtherCampaignToCompare"))}
                </div>
              )}
            </>
          )}
        </SelectOne>
        <SearchInput
          value={historySearch}
          onChange={e => setHistorySearch(e.target.value)}
          className={cx("mb-0", styles.searchHistory)}
        />
      </div>
      <HistoryTable
        campaignId1={campaignId1 ?? 0}
        campaignId2={campaignId2 ?? 0}
        searchHistory={historySearch}
      />
    </>
  ) : (
    <div className="alert alert-warning mt-4">
      {upperFirst(t("dashboard.comparisonImpossible"))}
    </div>
  );
};

export default HistoryTableTab;
