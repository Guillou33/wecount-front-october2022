import makeUseAllEntriesInfoBy from "@hooks/core/activityEntryInfo/makeUseAllEntriesInfoBy";
import { getSiteInfoByActivityModel } from "@lib/core/activityEntries/getEntityInfoByActivityModel";
import { makeSelectEntityInfoTotal } from "@selectors/activityEntryInfo/selectEntityInfoTotal";

const selectSiteInfoTotal = makeSelectEntityInfoTotal(
  getSiteInfoByActivityModel
);

const useSiteInfoTotal = makeUseAllEntriesInfoBy(selectSiteInfoTotal);

export default useSiteInfoTotal;
