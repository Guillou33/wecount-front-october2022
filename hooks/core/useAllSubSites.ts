import { RootState } from "@reducers/index";
import { Site, SiteList, SubSite, SubSiteList } from "@reducers/core/siteReducer";
import { t } from "i18next";
import { upperFirst } from "lodash";
import { useSelector } from "react-redux";

function useAllSubSites({ includeArchived = false } = {}): SubSite[] {
    const siteList = useSelector<RootState, SiteList>(
      state => state.core.site.siteList
    );
  
    const notAffectedSubSite: SubSite = {
      id: -1,
      name: upperFirst(t("site.notAffectedSite.name")),
      archivedDate: null,
      createdAt: "",
      description: upperFirst(t("site.notAffectedSite.description")),
    };

    const subSites: SubSite[] = Object.values(siteList).map(site => {
      if(site.subSites !== undefined && Object.values(site.subSites).length > 0){
        return Object.values(site.subSites).filter(
          subSite => includeArchived || subSite.archivedDate === null
        );
      }else return [];
    }).flat();

    return [...subSites, notAffectedSubSite];
}

export default useAllSubSites;