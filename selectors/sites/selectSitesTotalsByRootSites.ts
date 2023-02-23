import { createSelector } from "reselect";

import { selectSiteInfoTotal } from "@selectors/activityEntryInfo/selectEntityInfoTotal";
import selectSubSitesParents from "@selectors/sites/selectSubSitesParents";

import { EntryInfo } from "@lib/core/activityEntries/entryInfo";

type SitesTotalByRootSites = {
  [rootSiteId: number]: {
    [siteId: number]: EntryInfo;
  };
};

const selectSitesTotalsByRootSites = createSelector(
  [selectSiteInfoTotal, selectSubSitesParents],
  (siteInfoTotals, subSitesParent) => {
    return Object.entries(siteInfoTotals).reduce(
      (acc, [siteIdStr, siteInfo]) => {
        const currentSiteId = Number(siteIdStr);

        const rootSiteId = subSitesParent[currentSiteId] ?? currentSiteId;

        if (acc[rootSiteId] == null) {
          acc[rootSiteId] = {};
        }
        acc[rootSiteId][currentSiteId] = siteInfo;

        return acc;
      },
      {} as SitesTotalByRootSites
    );
  }
);

export default selectSitesTotalsByRootSites;
