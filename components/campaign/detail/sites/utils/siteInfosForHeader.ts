import useAllEntriesInfoBySite from "@hooks/core/activityEntryInfo/useAllEntriesBySite";
import useAllEntriesInfoBySiteWithSubSites from "@hooks/core/activityEntryInfo/useAllEntriesBySiteWithSubSites";
import useNotExcludedEntriesInfoBySite from "@hooks/core/notExcludedActivityEntryInfo/useNotExcludedEntriesBySite";
import useNotExcludedEntriesInfoBySiteWithSubSites from "@hooks/core/notExcludedActivityEntryInfo/useNotExcludedEntriesBySiteWithSubSites";
import { getInitialEntryInfo } from "@lib/core/activityEntries/entryInfo";
import { Site, SubSite } from "@reducers/core/siteReducer";


export const siteInfoForTco2Header = (campaignId: number, site: Site | SubSite | undefined, parentSite: Site | undefined) => {
    // allocated to a site and a level 2 site
    if(site !== undefined && parentSite !== undefined) 
        return useAllEntriesInfoBySite(campaignId)[site.id];

    // unallocated to any site
    if(site === undefined && parentSite === undefined) return useAllEntriesInfoBySite(campaignId)[-1];

    // allocated to a site but not to a level 2 site
    if(site === undefined && parentSite !== undefined) return useAllEntriesInfoBySite(campaignId)[parentSite.id];

    // allocated to a level 1 site
    if(site !== undefined && parentSite === undefined) return useAllEntriesInfoBySiteWithSubSites(campaignId)[site.id];
            
    return getInitialEntryInfo();
}

export const siteInfoForNotExcludedTco2Header = (campaignId: number, site: Site | SubSite | undefined, parentSite: Site | undefined) => {
    // allocated to a site and a level 2 site
    if(site !== undefined && parentSite !== undefined) 
        return useNotExcludedEntriesInfoBySite(campaignId)[site.id];

    // unallocated to any site
    if(site === undefined && parentSite === undefined) return useNotExcludedEntriesInfoBySite(campaignId)[-1];

    // allocated to a site but not to a level 2 site
    if(site === undefined && parentSite !== undefined) return useNotExcludedEntriesInfoBySite(campaignId)[parentSite.id];

    // allocated to a level 1 site
    if(site !== undefined && parentSite === undefined) return useNotExcludedEntriesInfoBySiteWithSubSites(campaignId)[site.id];
            
    return getInitialEntryInfo();
}