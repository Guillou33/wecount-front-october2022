import React from "react";
import useSetOnceEntriesOfCampaignsAvailableForHistory from "@hooks/core/reduxSetOnce/useSetOnceEntriesOfCampaignsAvailableForHistory";
import useAllSiteList from "@hooks/core/useAllSiteList";
import useAllSubSiteList from "@hooks/core/useAllSubSiteList";
import useArrayMemo from "@hooks/utils/useArrayMemo";
import { RootState } from "@reducers/index";
import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";
import selectActivityEntriesOfCampaignIdList from "@selectors/activityEntries/selectActivityEntriesOfCampaignIdList";
import selectCampaignsAvailableForHistoryWithCurrentCampaign from "@selectors/campaign/selectCampaignsAvailableForHistoryWithCurrentCampaign";
import selectFilteredEntriesOfMultipleCampaignsForSites from "@selectors/activityEntries/selectFilteredEntriesOfMultipleCampaignsForSites";
import { useSelector } from "react-redux";
import useSubSitesInSite from "@hooks/core/useSubSitesInSite";
import { EntriesByCampaign } from "@lib/core/activityEntries/getCampaignsEntryInfoByActivityModel";
import SiteDashboard from "@components/dashboard/campaign/sub/SiteDashboard";
import cx from "classnames";
import styles from "@styles/campaign/detail/sites/siteChart.module.scss";
import selectCampaignsFromAllTypes from "@selectors/campaign/selectCampaignsFromAllTypes";

interface Props {
    campaignId: number;
    siteId: number;
    parentSiteId: number | null;
}

const SiteDoughnut = ({
    campaignId,
    siteId,
    parentSiteId
}: Props) => {
    const siteList = useAllSiteList();

    const allCampaigns = useSelector(selectCampaignsFromAllTypes);
    const allCampaignsIds = useArrayMemo(
        Object.keys(allCampaigns).map(key => Number(key))
    );
    const entriesOfAllCampaigns = useSelector((state: RootState) =>
        selectActivityEntriesOfCampaignIdList(state, allCampaignsIds)
    );
    const filteredEntries = useSelector((state: RootState) =>
        selectFilteredEntriesOfMultipleCampaignsForSites(
            state,
            entriesOfAllCampaigns
        )
    );
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

    return (
        <div className={styles.siteDoughnut}>
            <div className={cx("col-11 mt-4 ml-4")}>
                <SiteDashboard entries={campaignEntriesForCurrentSite[campaignId]} />
            </div>
        </div>
    );
}

export default SiteDoughnut;