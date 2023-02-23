import { RootState } from "@reducers/index";
import { useDispatch, useSelector } from "react-redux";
import selectFilteredActivityEntriesForSites from "@selectors/activityEntries/selectFilteredActivityEntriesForSites";
import { t } from "i18next";
import styles from "@styles/campaign/detail/listing/activityEntryListing.module.scss";
import cx from "classnames";
import _, { upperFirst } from "lodash";
import useInfiniteScrollPagination from "@hooks/utils/useInfiniteScrollPagination";
import ActivityEntriesActionTopBar from "../../activity/sub/activity-entries/top-actions/ActivityEntriesActionTopBar";
import EntriesResultRecap from "../../sub/EntriesResultRecap";
import moment from "moment";
import { EntryCardMemo } from "../../activity/sub/activity-entries/EntryCard";
import { CardExpansionNames } from "@reducers/cardExpansion/cardExpansionReducer";
import useIsCardOpened from "@hooks/core/cardExpansion/useIsCardOpened";
import useAllEntriesInfoTotal from "@hooks/core/activityEntryInfo/useAllEntriesInfoTotal";
import { duplicateEntry, requestDeleteEntry, requestUpdateEntry } from "@actions/entries/campaignEntriesAction";
import { UnitModes } from "@reducers/campaignReducer";
import { closeCard, toggleCard } from "@actions/cardExpansion/cardExpansionActions";
import { Site, SubSite } from "@reducers/core/siteReducer";
import { entriesInSiteForList } from "../utils/entriesInSiteForList";

interface Props {
    campaignId: number;
    siteId: number;
    parentSiteId: number | null;
}

const SiteEntriesView = ({
    campaignId,
    siteId,
    parentSiteId
}: Props) => {
    const dispatch = useDispatch();

    const site = useSelector<RootState, Site>(
        state => state.core.site.siteList[siteId]
    );

    const parentSite = useSelector<RootState, Site>(
        state => state.core.site.siteList[parentSiteId ?? -1]
    );

    const filteredEntries = useSelector((state: RootState) =>
        selectFilteredActivityEntriesForSites(state, campaignId)
    );
    const listSelection = useSelector<RootState, Array<number>>(
      state => state.listSelectedEntries.siteEntries[`${siteId ?? -1} - ${parentSiteId ?? -1}`] !== undefined ? 
        state.listSelectedEntries.siteEntries[`${siteId ?? -1} - ${parentSiteId ?? -1}`].selectedEntries :
        []
    );
    
    const unitMode = useSelector<RootState, UnitModes | undefined>(
        state => state.campaign.campaigns[campaignId]?.unitMode
    );
    const entryInfoTotal = useAllEntriesInfoTotal(campaignId);

    const isCardOpened = useIsCardOpened(CardExpansionNames.SITE_LISTING_VIEW);
    
    const { containerRef, listSize } =
      useInfiniteScrollPagination(filteredEntries);

    const renderEmpty = () => {
        return (
            <div className={cx("text-center mt-5")}>
                <div className={styles.noResults}>
                <p>{upperFirst(t("filter.noResultForSites"))}.</p>
                </div>
            </div>
        );
    };

    if (entriesInSiteForList(filteredEntries, site, parentSite).length === 0) return renderEmpty();
    return (
        <>
            <div className={cx(styles.main)} ref={containerRef}>
                <div className={cx(styles.topBarListing)}>
                    <ActivityEntriesActionTopBar
                        editEntries={entriesInSiteForList(filteredEntries, site, parentSite)}
                        listSelection={listSelection}
                        activityModelId={undefined}
                        siteId={`${siteId ?? -1} - ${parentSiteId ?? -1}`}
                        view={"sites"}
                    />
                    <EntriesResultRecap 
                        entries={entriesInSiteForList(filteredEntries, site, parentSite)} 
                    />
                </div>
                <div className={cx(styles.gridListActivityEntries, "mt-0")}>
                {entriesInSiteForList(filteredEntries, site, parentSite)
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
                                siteId={`${siteId ?? -1} - ${parentSiteId ?? -1}`}
                                entryIndex={index}
                                isOpened={isCardOpened(entry.entryKey.toString())}
                                view={"sites"}
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
                                            cardExpansionName: CardExpansionNames.SITE_LISTING_VIEW,
                                            cardId: entry.entryKey,
                                        })
                                    );
                                }}
                                onClose={() =>
                                    dispatch(
                                        closeCard({
                                            cardExpansionName: CardExpansionNames.SITE_LISTING_VIEW,
                                            cardId: entry.entryKey,
                                        })
                                    )
                                }
                                onDuplicate={() =>
                                    dispatch(
                                        duplicateEntry({
                                            cardExpansionName: CardExpansionNames.SITE_LISTING_VIEW,
                                            activityEntryId:
                                            entry?.id && entry?.id !== undefined
                                                ? entry.id
                                                : null,
                                            computeMethodId: entry?.computeMethodId,
                                            campaignId: campaignId,
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
    )
};

export default SiteEntriesView;