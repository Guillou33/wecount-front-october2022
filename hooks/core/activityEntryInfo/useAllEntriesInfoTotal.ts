import makeUseAllEntriesInfoBy from "@hooks/core/activityEntryInfo/makeUseAllEntriesInfoBy";
import { makeSelectEntryInfoTotal } from "@selectors/activityEntryInfo/selectEntryInfoTotal";

const selectEntryInfoTotal = makeSelectEntryInfoTotal();

const useAllEntriesInfoTotal = makeUseAllEntriesInfoBy(selectEntryInfoTotal);

export default useAllEntriesInfoTotal;
