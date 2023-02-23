import { SiteList } from "@reducers/core/siteReducer";

export const getSubSite = (siteList: SiteList, siteId: number) => {
    const subSitesList = Object.values(siteList).map(site => {
        if(site.subSites === undefined){
          return [];
        }
        return Object.values(site.subSites)
      }).flat();

    const subSite = subSitesList.filter(subSite => subSite.id === siteId)[0];

    const parentSite = Object.values(siteList)
        .filter(site => site.subSites !== undefined && Object.values(site.subSites).includes(subSite))[0];

    return {
        ...subSite,
        parentSiteId: parentSite.id
    };
}