import { useState } from "react";
import { useSelector } from "react-redux";
import cx from "classnames";
import { upperFirst, throttle } from "lodash";
import { t } from "i18next";

import { RootState } from "@reducers/index";
import { useSort } from "@hooks/utils/useSort";
import memoValue from "@lib/utils/memoValue";
import useElementDimensions from "@hooks/utils/useElementDimensions";

import useActivityModelInfo from "@hooks/core/useActivityModelInfo";
import useAllSiteList from "@hooks/core/useAllSiteList";
import useAllProductList from "@hooks/core/useAllProductList";
import selectActivityEntriesOfCampaignIdList from "@selectors/activityEntries/selectActivityEntriesOfCampaignIdList";
import selectFilteredEntriesOfMultipleCampaignsForAnalysis from "@selectors/activityEntries/selectFilteredEntriesOfMultipleCampaignsForAnalysis";
import getHistoryFromEntries from "@lib/core/campaignHistory/getHistoryFromEntries";
import useSetOnceSites from "@hooks/core/reduxSetOnce/useSetOnceSites";
import useSetOnceProducts from "@hooks/core/reduxSetOnce/useSetOnceProducts";

import HistoryRow from "./HistoryRow";
import HeaderCell, { ActiveStatus } from "./HeaderCell";

import { EntriesHistory } from "@lib/core/campaignHistory/getHistoryFromEntries";
import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";
import { getSortMethods, SortFields } from "./helpers/sort";
import { getCampaignTypeShortName } from "@lib/core/campaign/getCampaignTypeName";

import styles from "@styles/dashboard/campaign/sub/historyTable/historyTable.module.scss";

interface Props {
  campaignId1: number;
  campaignId2: number;
  searchHistory?: string;
  filterHistoryFn?: (entriesHistory: EntriesHistory) => boolean;
}

const HistoryTable = ({
  campaignId1,
  campaignId2,
  searchHistory = "",
  filterHistoryFn,
}: Props) => {
  useSetOnceSites();
  useSetOnceProducts();

  const activityModelInfo = useActivityModelInfo();
  const siteList = useAllSiteList({ includeSubSites: true });
  const productList = useAllProductList();

  const campaign1Year = useSelector(
    (state: RootState) =>
      state.campaign.campaigns[campaignId1]?.information?.year ??
      `${t("campaign.campaign")} n°1`
  );
  const campaign2Year = useSelector(
    (state: RootState) =>
      state.campaign.campaigns[campaignId2]?.information?.year ??
      `${t("campaign.campaign")} n°2`
  );
  const campaign1Type = useSelector(
    (state: RootState) =>
      state.campaign.campaigns[campaignId1]?.information?.type
  );
  const campaign2Type = useSelector(
    (state: RootState) =>
      state.campaign.campaigns[campaignId2]?.information?.type
  );

  const isSameYear = campaign1Year === campaign2Year;
  const campaign1Text = `${campaign1Year}${
    isSameYear && campaign1Type != null
      ? ` ${getCampaignTypeShortName(campaign1Type)}`
      : ""
  }`;
  const campaign2Text = `${campaign2Year}${
    isSameYear && campaign2Type != null
      ? ` ${getCampaignTypeShortName(campaign2Type)}`
      : ""
  }`;

  const campaignIdList = memoValue([campaignId1, campaignId2]);

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

  const { sortField, updateSort, sortValues, sortDirAsc } = useSort<
    SortFields,
    EntriesHistory
  >(
    SortFields.CATEGORY_NAME,
    getSortMethods({
      campaignId1,
      campaignId2,
      getActivityModel: id => {
        if (id == null) {
          return null;
        }
        return activityModelInfo[id] ?? null;
      },
      getSite: id => (id ? siteList[id] : null),
      getProduct: id => (id ? productList[id] : null),
    })
  );

  const filteredHistory =
    filterHistoryFn == null
      ? Object.values(comparisonHistory)
      : Object.values(comparisonHistory).filter(filterHistoryFn);

  const searchedHistory =
    searchHistory === ""
      ? filteredHistory
      : filteredHistory.filter(entryHistory => {
          const campaign1Entry = entryHistory.entriesBycampaignId[campaignId1];
          const campaign2Entry = entryHistory.entriesBycampaignId[campaignId2];
          const { categoryName, activityModelName } = getHistoryNames(
            campaign1Entry,
            campaign2Entry
          );
          const lowerCasedSearchHistory = searchHistory.toLowerCase();
          const emissionFactorName =
            entryHistory.entriesBycampaignId[campaignId1]?.emissionFactor
              ?.name ?? "";

          return (
            categoryName.toLowerCase().includes(lowerCasedSearchHistory) ||
            activityModelName.toLowerCase().includes(lowerCasedSearchHistory) ||
            entryHistory.referenceId
              .toLowerCase()
              .includes(lowerCasedSearchHistory) ||
            emissionFactorName.toLowerCase().includes(lowerCasedSearchHistory)
          );
        });

  const sortedHistory = searchedHistory;
  sortValues(searchedHistory);

  function getHistoryNames(
    entryA: ActivityEntryExtended | undefined,
    entryB: ActivityEntryExtended | undefined
  ): {
    categoryName: string;
    activityModelName: string;
    siteName: string | null;
    productName: string | null;
  } {
    const activityModelId =
      entryA?.activityModelId ?? entryB?.activityModelId ?? -1;
    const activityModel = activityModelInfo[activityModelId];
    const siteId = entryA?.siteId ?? entryB?.siteId;
    const productId = entryA?.productId ?? entryB?.productId;

    const categoryName = activityModel?.category.name ?? "";
    const activityModelName = activityModel?.name ?? "";
    return {
      categoryName,
      activityModelName,
      siteName: siteId != null ? siteList[siteId]?.name : null,
      productName: productId != null ? productList[productId]?.name : null,
    };
  }
  const [firstColumnRef, { width: firstColumnWidth }] = useElementDimensions();
  const [secondColumnRef, { width: secondColumnWidth }] =
    useElementDimensions();
  const [thirdColumnRef, { width: thirdColumnWidth }] = useElementDimensions();
  const [fourthColumnRef, { width: fourthColumnWidth }] =
    useElementDimensions();
  const [fifthColumnRef, { width: fifthColumnWidth }] = useElementDimensions();

  const secondColumnOffset = firstColumnWidth;
  const thirdColumnOffset = secondColumnOffset + secondColumnWidth;
  const fourthColumnOffset = thirdColumnOffset + thirdColumnWidth;
  const fifthColumnOffset = fourthColumnOffset + fourthColumnWidth;
  const sixthColumnOffset = fifthColumnOffset + fifthColumnWidth;

  const columnOffsets = {
    secondColumnOffset,
    thirdColumnOffset,
    fourthColumnOffset,
    fifthColumnOffset,
    sixthColumnOffset,
  };

  function getActiveStatus(sortFieldAssociated: SortFields): ActiveStatus {
    if (sortField !== sortFieldAssociated) {
      return "inactive";
    }
    return sortDirAsc ? "active-asc" : "active-desc";
  }

  const [isScrolledLeft, setIsScrolledLeft] = useState(false);

  return sortedHistory.length === 0 ? (
    <div className="text-center font-italic font-weight-light">
      {upperFirst(t("global.noResult"))}
    </div>
  ) : (
    <div
      className={styles.historyTableWrapper}
      onScroll={throttle(e => {
        setIsScrolledLeft(e.target.scrollLeft > 0);
      }, 16)}
    >
      <table className={cx("wecount-table", styles.historyTable)}>
        <thead className={styles.tableHeader}>
          <tr>
            <HeaderCell
              ref={firstColumnRef}
              activeStatus={getActiveStatus(SortFields.CATEGORY_NAME)}
              onSort={() => updateSort(SortFields.CATEGORY_NAME)}
              className={cx(styles.stickyColumn, "text-nowrap")}
            >
              {upperFirst(t("activity.category.category"))}
            </HeaderCell>
            <HeaderCell
              ref={secondColumnRef}
              activeStatus={getActiveStatus(SortFields.ACTIVITY_MODEL_NAME)}
              onSort={() => updateSort(SortFields.ACTIVITY_MODEL_NAME)}
              style={{ left: secondColumnOffset }}
              className={cx(styles.stickyColumn, "text-nowrap")}
            >
              {upperFirst(t("activity.activity"))}
            </HeaderCell>
            <HeaderCell
              ref={thirdColumnRef}
              activeStatus={getActiveStatus(SortFields.ACTIVITY_ENTRY_CODE)}
              onSort={() => updateSort(SortFields.ACTIVITY_ENTRY_CODE)}
              className={cx(styles.stickyColumn, "text-nowrap")}
              style={{ left: thirdColumnOffset }}
            >
              {upperFirst(t("global.common.code"))}
            </HeaderCell>
            <HeaderCell
              ref={fourthColumnRef}
              activeStatus={getActiveStatus(SortFields.EMISSION_FACTOR_NAME)}
              onSort={() => updateSort(SortFields.EMISSION_FACTOR_NAME)}
              className={cx(styles.stickyColumn, "text-nowrap")}
              style={{ left: fourthColumnOffset }}
            >
              {upperFirst(
                t("footprint.emission.emissionFactor.emissionFactor")
              )}{" "}
              {campaign1Year}
            </HeaderCell>
            <HeaderCell
              ref={fifthColumnRef}
              activeStatus={getActiveStatus(SortFields.SITE_NAME)}
              onSort={() => updateSort(SortFields.SITE_NAME)}
              className={cx(styles.stickyColumn, "text-nowrap")}
              style={{ left: fifthColumnOffset }}
            >
              {upperFirst(t("site.site"))}
            </HeaderCell>
            <HeaderCell
              activeStatus={getActiveStatus(SortFields.PRODUCT_NAME)}
              onSort={() => updateSort(SortFields.PRODUCT_NAME)}
              className={cx(styles.stickyColumn, "text-nowrap", {
                [styles.shadowed]: isScrolledLeft,
              })}
              style={{ left: sixthColumnOffset }}
            >
              {upperFirst(t("product.product"))}
            </HeaderCell>
            <HeaderCell
              activeStatus={getActiveStatus(SortFields.INPUT_1_CAMPAIGN_1)}
              onSort={() => updateSort(SortFields.INPUT_1_CAMPAIGN_1)}
            >
              {`Input 1 ${campaign1Text}`}
            </HeaderCell>
            <HeaderCell
              activeStatus={getActiveStatus(SortFields.INPUT_1_CAMPAIGN_2)}
              onSort={() => updateSort(SortFields.INPUT_1_CAMPAIGN_2)}
            >
              {`Input 1 ${campaign2Text}`}
            </HeaderCell>
            <HeaderCell
              activeStatus={getActiveStatus(SortFields.INPUT_1_EVOLUTION)}
              onSort={() => updateSort(SortFields.INPUT_1_EVOLUTION)}
            >
              {upperFirst(t("global.common.evolution"))}
            </HeaderCell>
            <HeaderCell
              activeStatus={getActiveStatus(SortFields.INPUT_2_CAMPAIGN_1)}
              onSort={() => updateSort(SortFields.INPUT_2_CAMPAIGN_1)}
            >
              {`Input 2 ${campaign1Text}`}
            </HeaderCell>
            <HeaderCell
              activeStatus={getActiveStatus(SortFields.INPUT_2_CAMPAIGN_2)}
              onSort={() => updateSort(SortFields.INPUT_2_CAMPAIGN_2)}
            >
              {`Input 2 ${campaign2Text}`}
            </HeaderCell>
            <HeaderCell
              activeStatus={getActiveStatus(SortFields.INPUT_2_EVOLUTION)}
              onSort={() => updateSort(SortFields.INPUT_2_EVOLUTION)}
            >
              {upperFirst(t("global.common.evolution"))}
            </HeaderCell>
            <HeaderCell
              activeStatus={getActiveStatus(SortFields.EMISSION_CAMPAIGN_1)}
              onSort={() => updateSort(SortFields.EMISSION_CAMPAIGN_1)}
            >
              {`${upperFirst(
                t("footprint.emission.emission.singular")
              )} ${campaign1Text}`}
            </HeaderCell>
            <HeaderCell
              activeStatus={getActiveStatus(SortFields.EMISSION_CAMPAIGN_2)}
              onSort={() => updateSort(SortFields.EMISSION_CAMPAIGN_2)}
            >
              {`${upperFirst(
                t("footprint.emission.emission.singular")
              )} ${campaign2Text}`}
            </HeaderCell>
            <HeaderCell
              activeStatus={getActiveStatus(SortFields.EMISSION_EVOLUTION)}
              onSort={() => updateSort(SortFields.EMISSION_EVOLUTION)}
            >
              {upperFirst(t("global.common.evolution"))}
            </HeaderCell>
          </tr>
        </thead>
        <tbody>
          {sortedHistory.map(entryHistory => {
            const campaign1Entry =
              entryHistory.entriesBycampaignId[campaignId1];
            const campaign2Entry =
              entryHistory.entriesBycampaignId[campaignId2];
            const { categoryName, activityModelName, siteName, productName } =
              getHistoryNames(campaign1Entry, campaign2Entry);
            return (
              <HistoryRow
                key={entryHistory.referenceId}
                categoryName={categoryName}
                activityModelName={activityModelName}
                siteName={siteName}
                productName={productName}
                referenceId={entryHistory.referenceId}
                campaign1Entry={campaign1Entry}
                campaign2Entry={campaign2Entry}
                searchHistory={searchHistory}
                columnOffsets={columnOffsets}
                isScolledLeft={isScrolledLeft}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryTable;
