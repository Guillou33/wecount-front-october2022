import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import cx from "classnames";
import { upperFirst } from "lodash";
import { t } from "i18next";

import { CampaignInformation } from "@reducers/campaignReducer";
import { CampaignType } from "@custom-types/core/CampaignType";
import { RootState } from "@reducers/index";
import { WaterfallData } from "@hooks/core/waterfall/helpers/waterfallData";

import memoValue from "@lib/utils/memoValue";

import useSetAllEntries from "@hooks/core/reduxSetOnce/useSetAllEntries";
import useWaterfallFilters from "@hooks/core/waterfall/useWaterfallFilters";

import selectCampaignsAvailableForHistory from "@selectors/campaign/selectCampaignsAvailableForHistory";
import selectAreCampaignEntriesFetched from "@selectors/campaign/selectAreCampaignEntriesFetched";
import selectSimulationOfCampaign from "@selectors/campaign/selectSimulationOfCampaign";

import { SelectOne, Option } from "@components/helpers/ui/selects";
import HistoryTable from "@components/dashboard/campaign/sub/HistoryTable/HistoryTable";
import Waterfall from "@components/dashboard/campaign/sub/Waterfall";
import Spinner from "@components/helpers/ui/Spinner";
import WaterfallDataSelect from "@components/dashboard/campaign/dashboardViews/comparisonDashboards/sub/WaterfallDataSelect";

import styles from "@styles/dashboard/campaign/campaignDashboard.module.scss";

interface Props {
  campaignId: number;
  campaignInformation: CampaignInformation | undefined;
}

const WaterfallTab = ({ campaignId, campaignInformation }: Props) => {
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
  const campaignIds = memoValue([campaignId1 ?? 0, campaignId2 ?? 0] as [
    number,
    number
  ]);

  const [selectedWaterfallData, setSelectedWaterfallData] = useState<
    keyof WaterfallData | null
  >(null);

  const areCampaignOneEntriesFetched = useSelector((state: RootState) =>
    selectAreCampaignEntriesFetched(state, campaignId1)
  );
  const areCampaignTwoEntriesFetched = useSelector((state: RootState) =>
    selectAreCampaignEntriesFetched(state, campaignId2)
  );
  const isReady = areCampaignOneEntriesFetched && areCampaignTwoEntriesFetched;

  const waterfallFilters = useWaterfallFilters(campaignIds);
  const currentWaterfallFilter =
    selectedWaterfallData == null
      ? undefined
      : waterfallFilters[selectedWaterfallData];

  const ref = useRef<HTMLDivElement | null>(null);

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
      </div>
      <div
        className={cx(
          styles.categoriesDashboardContainer,
          styles.dynamicHeight,
          styles.first,
          styles.spaceBottom
        )}
      >
        {isReady ? (
          <Waterfall
            campaignId1={campaignId1 ?? 0}
            campaignId2={campaignId2 ?? 0}
            onDataClick={dataName => {
              setSelectedWaterfallData(dataName);
              if (ref.current != null) {
                const { top } = ref.current.getBoundingClientRect();
                window.scrollTo({
                  top: top + document.documentElement.scrollTop - 100,
                });
              }
            }}
          />
        ) : (
          <Spinner />
        )}
      </div>
      <div className={styles.historyListCampaignSelection} ref={ref}>
        <WaterfallDataSelect
          campaignIds={campaignIds}
          selected={selectedWaterfallData}
          onChange={setSelectedWaterfallData}
        />
      </div>
      <div className={styles.historyTableWrapper}>
        <HistoryTable
          campaignId1={campaignId1 ?? 0}
          campaignId2={campaignId2 ?? 0}
          filterHistoryFn={currentWaterfallFilter}
        />
      </div>
    </>
  ) : (
    <div className="alert alert-warning mt-4">
      {upperFirst(t("dashboard.comparisonImpossible"))}
    </div>
  );
};

export default WaterfallTab;
