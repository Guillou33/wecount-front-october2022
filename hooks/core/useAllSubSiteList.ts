import { RootState } from "@reducers/index";
import { Site, SiteList, SubSite, SubSiteList } from "@reducers/core/siteReducer";
import { t } from "i18next";
import { upperFirst } from "lodash";
import { useSelector } from "react-redux";

function useAllSubSitesList({ includeArchived = false } = {}): SubSiteList {
    const siteList = useSelector<RootState, SiteList>(
      state => state.core.site.siteList
    );

    const subSites: SubSiteList = Object.values(siteList).map(site => {
      if(site.subSites !== undefined){
        return Object.values(site.subSites).filter(
          subSite => includeArchived || subSite.archivedDate === null
        );
      }else return [];
    })
    .flat()
    .reduce((subSiteList, subSite) => {
        subSiteList[subSite.id] = { ...subSite };
        return subSiteList;
      }, {} as SubSiteList);

    return subSites;
}

export default useAllSubSitesList;