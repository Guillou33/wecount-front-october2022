import { createSelector } from "reselect";

import { RootState } from "@reducers/index";

type SitesRelationship = {
  [siteId: number]: number;
};

const selectSubSitesParents = createSelector(
  [(state: RootState) => state.core.site.siteList],
  allSites => {
    return Object.values(allSites).reduce((acc, site) => {
      if(site.subSites != null){
        Object.values(site.subSites).forEach((subSite) => {
          acc[subSite.id] = site.id;
        })
      }
      return acc;
    }, {} as SitesRelationship);
  }
);

export default selectSubSitesParents;
