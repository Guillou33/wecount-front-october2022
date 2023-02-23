import memoize from "lodash/memoize";
import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";

function makeEntityIdsOfEntryListGetter(entityName: "siteId" | "productId") {
  return memoize((entryList: ActivityEntryExtended[]): Record<number, true> => {
    return entryList.reduce((acc, entry) => {
      const entityId = entry[entityName];
      if (entityId != null) {
        acc[entityId] = true;
      }
      return acc;
    }, {} as Record<number, true>);
  });
}

const getSiteIdsOfEntryList = makeEntityIdsOfEntryListGetter("siteId");
const getProductIdsOfEntryList = makeEntityIdsOfEntryListGetter("productId");

export { getSiteIdsOfEntryList, getProductIdsOfEntryList };
