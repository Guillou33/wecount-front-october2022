import { createSelector } from "reselect";

import { SiteList } from "@reducers/core/siteReducer";

import { RootState } from "@reducers/index";

const selectUnarchivedSites = createSelector(
  [(state: RootState) => state.core.site.siteList],
  siteList => {
    return Object.values(siteList).reduce((acc, site) => {
      if (site.archivedDate == null) {
        acc[site.id] = site;
      }
      return acc;
    }, {} as SiteList);
  }
);

export default selectUnarchivedSites;
