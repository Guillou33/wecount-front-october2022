import { SiteList } from "@reducers/core/siteReducer";
import useAllSites from "@hooks/core/useAllSites";
import useAllSubSites from "./useAllSubSites";

// get sites with or without subsites
export default function useAllSiteList({
  includeArchived = false,
  includeSubSites = false,
} = {}): SiteList {
  const allSites = useAllSites({ includeArchived });

  const allSubSites = useAllSubSites();

  const sitesPossiblyFiltered = includeSubSites
    ? allSites
    : allSites.filter(
        site => !allSubSites.map(subSite => subSite.id).includes(site.id)
      );

  return sitesPossiblyFiltered.reduce((siteList, site) => {
    siteList[site.id] = { ...site };
    return siteList;
  }, {} as SiteList);
}
