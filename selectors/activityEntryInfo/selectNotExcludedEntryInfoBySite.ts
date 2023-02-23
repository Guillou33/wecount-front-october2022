import { createSelector } from "reselect";

import { RootState } from "@reducers/index";

import getEntryInfoByActivityModel from "@lib/core/activityEntries/getEntryInfoByActivityModel";
import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";
import {
  EntryInfo,
  getInitialEntryInfo,
} from "@lib/core/activityEntries/entryInfo";

import { getEntryInfoBySite } from "@lib/core/activityEntries/getEntryInfoBySite";
import selectAllSites from "@selectors/sites/selectAllSites";

const makeSelectNotExcludedEntryInfoBySite = () => {
  const selectNotExcludedEntryInfoBySite = createSelector(
    [
      selectAllSites,
      (_: RootState, activityEntries: ActivityEntryExtended[]) =>
        getEntryInfoBySite(activityEntries.filter(entry => !entry.isExcludedFromTrajectory)),
    ],
    (siteList, entryInfoByAllSite) => {
      const allSiteInfo = Object.values(siteList).reduce((acc, site) => {
        acc[site.id] =
          entryInfoByAllSite[site.id] ?? getInitialEntryInfo();
        return acc;
      }, {} as Record<number, EntryInfo>);
      
      return allSiteInfo;
    }
  );
  return selectNotExcludedEntryInfoBySite;
}

export default makeSelectNotExcludedEntryInfoBySite();

export { makeSelectNotExcludedEntryInfoBySite };

