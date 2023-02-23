import { getWriterInfoByActivityModel } from "@lib/core/activityEntries/getEntityInfoByActivityModel";
import { makeSelectEntityInfoTotal } from "@selectors/activityEntryInfo/selectEntityInfoTotal";
import makeUseUsersEntriesInfoBy from "./makeUseUsersEntriesInfoBy";

const selectWriterInfoTotal = makeSelectEntityInfoTotal(
  getWriterInfoByActivityModel
);

const useWriterInfoTotal = makeUseUsersEntriesInfoBy(selectWriterInfoTotal);

export default useWriterInfoTotal;
