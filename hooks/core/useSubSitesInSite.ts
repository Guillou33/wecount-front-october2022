import { RootState } from "@reducers/index";
import { Site, SiteList, SubSite } from "@reducers/core/siteReducer";
import { t } from "i18next";
import { upperFirst } from "lodash";
import { useSelector } from "react-redux";

function useSubSitesInSite({ includeArchived = false } = {}, site: Site): SubSite[] {
  
    const notAffectedSubSite: SubSite = {
      id: -1,
      name: upperFirst(t("site.notAffectedSite.name")),
      archivedDate: null,
      createdAt: "",
      description: upperFirst(t("site.notAffectedSite.description")),
    };
  
    const subSites: SubSite[] = site === undefined || site.subSites === undefined ? [] : Object.values(site.subSites).filter(
      subSite => includeArchived || subSite.archivedDate === null
    );

    return [...subSites, notAffectedSubSite];
}

export default useSubSitesInSite;