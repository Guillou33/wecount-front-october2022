import { createSelector } from "reselect";

import selectSitesTotalsByRootSites from "@selectors/sites/selectSitesTotalsByRootSites";
import mapObject from "@lib/utils/mapObject";

import {
  getEntryInfoSum,
  getInitialEntryInfo,
} from "@lib/core/activityEntries/entryInfo";

const selectRootSiteTotals = createSelector(
  [selectSitesTotalsByRootSites],
  sitesTotalsByRootSites => {
    return mapObject(sitesTotalsByRootSites, sitesTotalByRootSite => {
      return Object.values(sitesTotalByRootSite).reduce(
        getEntryInfoSum,
        getInitialEntryInfo()
      );
    });
  }
);

export default selectRootSiteTotals;
