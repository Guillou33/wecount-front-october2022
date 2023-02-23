import makeUseAllEntriesInfoBy from "@hooks/core/activityEntryInfo/makeUseAllEntriesInfoBy";
import { getProductInfoByActivityModel } from "@lib/core/activityEntries/getEntityInfoByActivityModel";
import { makeSelectEntityInfoTotal } from "@selectors/activityEntryInfo/selectEntityInfoTotal";

const selectProductInfoTotal = makeSelectEntityInfoTotal(
  getProductInfoByActivityModel
);

const useProductInfoTotal = makeUseAllEntriesInfoBy(selectProductInfoTotal);

export default useProductInfoTotal;
