import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@reducers/index";
import { EntryCardMemo } from "@components/campaign/detail/activity/sub/activity-entries/EntryCard";
import _, { upperFirst } from "lodash";
import styles from "@styles/campaign/detail/listing/activityEntryListing.module.scss";
import cx from "classnames";
import useSetOnceUsers from "@hooks/core/reduxSetOnce/useSetOnceUsers";
import selectFilteredActivityEntriesForListingView from "@selectors/activityEntries/selectFilteredActivityEntriesForListingView";

import EntriesResultRecap from "@components/campaign/detail/sub/EntriesResultRecap";

import { CardExpansionNames } from "@reducers/cardExpansion/cardExpansionReducer";
import useIsCardOpened from "@hooks/core/cardExpansion/useIsCardOpened";

import {
  closeCard,
  toggleCard,
} from "@actions/cardExpansion/cardExpansionActions";

import useAllEntriesInfoTotal from "@hooks/core/activityEntryInfo/useAllEntriesInfoTotal";
import { UnitModes } from "@reducers/campaignReducer";

import {
  requestUpdateEntry,
  requestDeleteEntry,
  duplicateEntry,
} from "@actions/entries/campaignEntriesAction";
import moment from "moment";
import { t } from "i18next";
import ActivityEntriesActionTopBar from "../activity/sub/activity-entries/top-actions/ActivityEntriesActionTopBar";
import useInfiniteScrollPagination from "@hooks/utils/useInfiniteScrollPagination";

const ActivityEntryListing = () => {
  const dispatch = useDispatch();
  useSetOnceUsers();
  const currentCampaignId = useSelector<RootState, number>(
    state => state.campaign.currentCampaign!
  );

  const filteredEntries = useSelector((state: RootState) =>
    selectFilteredActivityEntriesForListingView(state, currentCampaignId)
  );
  const listSelection = useSelector<RootState, Array<number>>(
    state => state.listSelectedEntries.selectedEntries
  );

  const campaignId = useSelector<RootState, number>(
    // Set in getInitialProps
    state => state.campaign.currentCampaign!
  );
  const unitMode = useSelector<RootState, UnitModes | undefined>(
    state => state.campaign.campaigns[campaignId]?.unitMode
  );
  const entryInfoTotal = useAllEntriesInfoTotal(campaignId);

  const isCardOpened = useIsCardOpened(CardExpansionNames.LISTING_VIEW);

  const { containerRef, listSize } =
    useInfiniteScrollPagination(filteredEntries);

  const renderEmpty = () => {
    return (
      <div className={cx("text-center mt-5")}>
        <div className={styles.noResults}>
          <p>{upperFirst(t("filter.noResultForActivities"))}.</p>
        </div>
      </div>
    );
  };

  if (filteredEntries.length === 0) return renderEmpty();
  return (
    <>
      <div className={cx(styles.main)} ref={containerRef}>
        <div className={cx(styles.topBarListing)}>
          <ActivityEntriesActionTopBar
            editEntries={filteredEntries}
            listSelection={listSelection}
            activityModelId={undefined}
            view={"list"}
          />
          <EntriesResultRecap entries={filteredEntries} />
        </div>
        <div className={cx(styles.gridListActivityEntries, "mt-0")}>
          {filteredEntries
            .sort((entry1, entry2) => {
              const entry1Date = moment(entry1.createdAt).unix();
              const entry2Date = moment(entry2.createdAt).unix();
              return entry1Date > entry2Date
                ? -1
                : entry2Date > entry1Date
                  ? 1
                  : 0;
            })
            .slice(0, listSize)
            .map((entry, index) => {
              return (
                <EntryCardMemo
                  key={index}
                  entry={{ ...entry, updatedAt: entry.updatedAt?.toString() }}
                  entryKey={entry.entryKey}
                  campaignId={campaignId}
                  activityModelId={entry.activityModelId!}
                  siteId={entry.siteId?.toString() ?? null}
                  entryIndex={index}
                  isOpened={isCardOpened(entry.entryKey.toString())}
                  view={"list"}
                  onEntryChange={entryData => {
                    dispatch(
                      requestUpdateEntry({
                        campaignId,
                        entryKey: entry.entryKey,
                        entryId: entry.id,
                        activityModelId: entry.activityModelId,
                        entryData,
                      })
                    );
                  }}
                  totalTco2={entryInfoTotal.tCo2}
                  unitMode={unitMode}
                  onToggleCard={() => {
                    dispatch(
                      toggleCard({
                        cardExpansionName: CardExpansionNames.LISTING_VIEW,
                        cardId: entry.entryKey,
                      })
                    );
                  }}
                  onClose={() =>
                    dispatch(
                      closeCard({
                        cardExpansionName: CardExpansionNames.LISTING_VIEW,
                        cardId: entry.entryKey,
                      })
                    )
                  }
                  onDuplicate={() =>
                    dispatch(
                      duplicateEntry({
                        cardExpansionName: CardExpansionNames.LISTING_VIEW,
                        activityEntryId:
                          entry?.id && entry?.id !== undefined
                            ? entry.id
                            : null,
                        computeMethodId: entry?.computeMethodId,
                        campaignId: currentCampaignId,
                      })
                    )
                  }
                  onDelete={() =>
                    dispatch(
                      requestDeleteEntry({
                        campaignId,
                        entryKey: entry.entryKey,
                        entryId: entry.id,
                      })
                    )
                  }
                />
              );
            })}
        </div>
      </div>
    </>
  );
};

export default ActivityEntryListing;
