import { getSiteInfoByActivityModel } from "@lib/core/activityEntries/getEntityInfoByActivityModel";
import { makeSelectEntityInfoTotal } from "@selectors/activityEntryInfo/selectEntityInfoTotal";
import makeUseSitesEntriesInfoBy from "./makeUseSitesEntriesInfoBy";

const selectSiteInfoTotal = makeSelectEntityInfoTotal(
  getSiteInfoByActivityModel
);

const useSiteInfoFiltered = makeUseSitesEntriesInfoBy(selectSiteInfoTotal);

export default useSiteInfoFiltered;
