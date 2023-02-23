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

const makeSelectEntryInfoBySite = () => {
  const selectEntryInfoBySite = createSelector(
    [
      selectAllSites,
      (_: RootState, activityEntries: ActivityEntryExtended[]) =>
        getEntryInfoBySite(activityEntries),
    ],
    (siteList, entryInfoByAllSite) => {
    const allSiteInfo = Object.values(siteList).reduce((acc, site) => {
        acc[site.id ?? -1] =
          entryInfoByAllSite[site.id ?? -1] ?? getInitialEntryInfo();
        return acc;
      }, {} as Record<number, EntryInfo>);
      return allSiteInfo;
    }
  );
  return selectEntryInfoBySite;
}

export default makeSelectEntryInfoBySite();

export { makeSelectEntryInfoBySite };

