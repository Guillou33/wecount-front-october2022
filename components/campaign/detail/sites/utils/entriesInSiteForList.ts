import { Site, SubSite } from "@reducers/core/siteReducer";
import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";

export const entriesInSiteForList = (filteredEntries: ActivityEntryExtended[], site: Site | SubSite | undefined, parentSite: Site | undefined) => {

    // unallocated to any site
    if(site === undefined && parentSite === undefined) return filteredEntries.filter(entry => entry.siteId === null);

    // allocated to a site but not to a level 2 site
    if(site !== undefined && parentSite === undefined) {
        const mainSite = site as Site;
        const subSites = mainSite.subSites === undefined ? [] : mainSite.subSites;
        return filteredEntries.filter(entry => (site !== undefined && entry.siteId === site.id) || (entry.siteId && subSites !== undefined && Object.keys(subSites).includes(entry.siteId?.toString())));
    }

    // allocated to a level 2 site but not to a site
    if(parentSite !== undefined && site === undefined) return filteredEntries.filter(entry => parentSite !== undefined && entry.siteId === parentSite.id);

    // allocated to a site and a level 2 site
    if(site !== undefined && parentSite !== undefined) 
        return filteredEntries
            .filter(entry => 
                (site !== undefined && entry.siteId === site.id) 
                // || (parentSite !== undefined && entry.siteId === parentSite.id)
            );
            
    return filteredEntries;
}
