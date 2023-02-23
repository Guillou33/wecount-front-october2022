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
import { Status } from "@custom-types/core/Status";
import { getInitialNbByStatus } from "@lib/core/activityEntries/nbByStatus";
import useSubSitesInSite from "@hooks/core/useSubSitesInSite";

const makeSelectNotExcludedEntryInfoBySiteWithSubSites = () => {
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
        const subSites = useSubSitesInSite({}, site);
        if(subSites.length > 1){
          let initialInfo = {
            nb: acc[site.id].nb,
            hasInProgressStatuses: acc[site.id].hasInProgressStatuses,
            status: acc[site.id].status,
            tCo2: acc[site.id].tCo2,
            nbByStatus: {
              [Status.ARCHIVED]: acc[site.id].nbByStatus.ARCHIVED,
              [Status.IN_PROGRESS]: acc[site.id].nbByStatus.IN_PROGRESS,
              [Status.TO_VALIDATE]: acc[site.id].nbByStatus.TO_VALIDATE,
              [Status.TERMINATED]: acc[site.id].nbByStatus.TERMINATED,
            },
          };
          subSites.filter(subSite => subSite.id !== -1).forEach(subSite => {
            const entryInfoBySubSite = entryInfoByAllSite[subSite.id];
            if(entryInfoBySubSite !== undefined){
              initialInfo.nb += entryInfoBySubSite.nb;
              initialInfo.tCo2 += entryInfoBySubSite.tCo2;
              initialInfo.nbByStatus.ARCHIVED += entryInfoBySubSite.nbByStatus.ARCHIVED;
              initialInfo.nbByStatus.IN_PROGRESS += entryInfoBySubSite.nbByStatus.IN_PROGRESS;
              initialInfo.nbByStatus.TO_VALIDATE += entryInfoBySubSite.nbByStatus.TO_VALIDATE;
              initialInfo.nbByStatus.TERMINATED += entryInfoBySubSite.nbByStatus.TERMINATED;
            }
          });
          acc[site.id] = initialInfo;
        }
        return acc;
      }, {} as Record<number, EntryInfo>);
      
      return allSiteInfo;
    }
  );
  return selectNotExcludedEntryInfoBySite;
}

export default makeSelectNotExcludedEntryInfoBySiteWithSubSites();

export { makeSelectNotExcludedEntryInfoBySiteWithSubSites };

