import { SiteDataForCreation } from "@custom-types/core/Sites";
import { SiteList } from "@reducers/core/siteReducer";
import { SitesDataList } from "@reducers/dataImport/sitesDataReducer";
import _ from "lodash";

const useHierarchicalSites = (sitesDataList: SitesDataList) => {
    const levelTwoSites = _.filter(sitesDataList, (siteData, key) => siteData.level === 2);

    const sites: SiteDataForCreation[] = _.map(sitesDataList, site => {
        return {
            name: site.name,
            description: site.description,
            archivedDate: null,
            parent: site.parent ?? "",
            level: site.level,
            subSites: levelTwoSites
                .filter(subSite => subSite.parent === site.name)
                .map(subSite => {
                    return {
                        name: subSite.name,
                        description: subSite.description,
                        archivedDate: null,
                    }
                })
        }
    });


    return sites;
}

export default useHierarchicalSites;