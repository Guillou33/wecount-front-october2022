import makeUseAllEntriesInfoBy from "@hooks/core/activityEntryInfo/makeUseAllEntriesInfoBy";
import { getOwnerInfoByActivityModel } from "@lib/core/activityEntries/getEntityInfoByActivityModel";
import { makeSelectEntityInfoTotal } from "@selectors/activityEntryInfo/selectEntityInfoTotal";

const selectOwnerInfoTotal = makeSelectEntityInfoTotal(
  getOwnerInfoByActivityModel
);

const useOwnerInfoTotal = makeUseAllEntriesInfoBy(selectOwnerInfoTotal);

export default useOwnerInfoTotal;
