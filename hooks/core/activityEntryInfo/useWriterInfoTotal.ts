import makeUseAllEntriesInfoBy from "@hooks/core/activityEntryInfo/makeUseAllEntriesInfoBy";
import { getWriterInfoByActivityModel } from "@lib/core/activityEntries/getEntityInfoByActivityModel";
import { makeSelectEntityInfoTotal } from "@selectors/activityEntryInfo/selectEntityInfoTotal";

const selectWriterInfoTotal = makeSelectEntityInfoTotal(
  getWriterInfoByActivityModel
);

const useWriterInfoTotal = makeUseAllEntriesInfoBy(selectWriterInfoTotal);

export default useWriterInfoTotal;
