
import { getOwnerInfoByActivityModel } from "@lib/core/activityEntries/getEntityInfoByActivityModel";
import { makeSelectEntityInfoTotal } from "@selectors/activityEntryInfo/selectEntityInfoTotal";
import makeUseUsersEntriesInfoBy from "./makeUseUsersEntriesInfoBy";

const selectOwnerInfoTotal = makeSelectEntityInfoTotal(
  getOwnerInfoByActivityModel
);

const useOwnerInfoTotal = makeUseUsersEntriesInfoBy(selectOwnerInfoTotal);

export default useOwnerInfoTotal;
