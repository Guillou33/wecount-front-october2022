import React from "react";
import { useSelector } from "react-redux";
import useArrayMemo from "@hooks/utils/useArrayMemo";
import { RootState } from "@reducers/index";
import styles from "@styles/campaign/detail/sites/siteChart.module.scss";

import useSetOnceEntriesOfCampaignsAvailableForHistory from "@hooks/core/reduxSetOnce/useSetOnceEntriesOfCampaignsAvailableForHistory";
import useYearSpanOfEntriesByCampaign from "@hooks/core/useYearSpanOfEntriesByCampaign";
import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";
import selectAreEntriesOfCampaignsAllFetched from "@selectors/activityEntries/selectAreEntriesOfCampaignsAllFetched";
import selectActivityEntriesOfCampaignIdList from "@selectors/activityEntries/selectActivityEntriesOfCampaignIdList";
import selectCampaignsAvailableForHistoryWithCurrentCampaign from "@selectors/campaign/selectCampaignsAvailableForHistoryWithCurrentCampaign";
import selectFilteredEntriesOfMultipleCampaignsForSites from "@selectors/activityEntries/selectFilteredEntriesOfMultipleCampaignsForSites";
import getHistoryFromEntries from "@lib/core/campaignHistory/getHistoryFromEntries";
import useSubSitesInSite from "@hooks/core/useSubSitesInSite";
import { EntriesByCampaign } from "@lib/core/activityEntries/getCampaignsEntryInfoByActivityModel";
import { t } from "i18next";
import { upperFirst } from "lodash";
import { siteTitleForHeader } from "../utils/siteTitleForHeader";
import useAllSiteList from "@hooks/core/useAllSiteList";
import useAllSubSiteList from "@hooks/core/useAllSubSiteList";
import HistorySiteChart from "@components/dashboard/campaign/sub/HistoryChart/HistorySiteChart";
import mapObject from "@lib/utils/mapObject";

interface Props {
    campaignId: number;
    siteId: number;
    parentSiteId: number | null;
}

const SiteHistory = ({
    campaignId,
    siteId,
    parentSiteId
}: Props) => {
    useSetOnceEntriesOfCampaignsAvailableForHistory();

    const siteList = useAllSiteList();
    const subSiteList = useAllSubSiteList();

    const campaignsAvailableForHistory = useSelector(selectCampaignsAvailableForHistoryWithCurrentCampaign);
    const campaignAvailableForHistoryIds = useArrayMemo(
        Object.keys(campaignsAvailableForHistory).map(key => Number(key))
    );
    const entriesOfCampaignsAvailableForHistory = useSelector((state: RootState) =>
        selectActivityEntriesOfCampaignIdList(state, campaignAvailableForHistoryIds)
    );
    const filteredEntries = useSelector((state: RootState) =>
        selectFilteredEntriesOfMultipleCampaignsForSites(
            state,
            entriesOfCampaignsAvailableForHistory
        )
    );
    const entriesOfCampaignsAvailableForHistoryAllFetched = useSelector(
        (state: RootState) =>
            selectAreEntriesOfCampaignsAllFetched(state, campaignAvailableForHistoryIds)
    );

    const siteName = siteTitleForHeader(parentSiteId ? subSiteList[siteId ?? -1] : siteList[siteId ?? -1], siteList[parentSiteId ?? -1]);

    const checkParentSite = (
        entry: ActivityEntryExtended, 
        siteId: number, 
        parentSiteId: number | null
    ) => {
        if(parentSiteId){
            if(siteId === -1){
                return entry.siteId === parentSiteId;
            }
            return entry.siteId === siteId;
        }
        if(siteId === -1){
            return entry.siteId === null;
        }
        const subSites = useSubSitesInSite({}, siteList[siteId]);
        const subSiteIds = subSites.length > 0 ? subSites.map(subSite => subSite.id) : [];
        return entry.siteId && (entry.siteId === siteId || subSiteIds.includes(entry.siteId));
    }

    const campaignEntriesForCurrentSite = Object.entries(
        filteredEntries
      ).reduce((acc, [campaignId, entries]) => {
        acc[Number(campaignId)] = entries.filter(
          entry => checkParentSite(entry, siteId, parentSiteId)
        );
        return acc;
      }, {} as EntriesByCampaign);

    const siteHistory = getHistoryFromEntries(
        campaignEntriesForCurrentSite
    );
    const siteYearSpan = useYearSpanOfEntriesByCampaign(
        entriesOfCampaignsAvailableForHistory
    );

    return siteYearSpan == null ||
        !entriesOfCampaignsAvailableForHistoryAllFetched ? (
        <div className="d-flex ml-5 align-items-center">
            <div className="spinner-border text-secondary mr-3"></div>
            <div style={{marginTop: 20}}>{upperFirst(t("global.data.loadingData"))}...</div>
        </div>
    ) : (
        <div className={styles.siteChartContainer}>
            <HistorySiteChart
                historyOfEntries={siteHistory}
                yearSpan={siteYearSpan}
                siteName={siteName}
                campaignTypes={mapObject(
                    campaignsAvailableForHistory,
                    campaign => campaign.information.type
                )}
            />
        </div>
    );
}

export default SiteHistory;