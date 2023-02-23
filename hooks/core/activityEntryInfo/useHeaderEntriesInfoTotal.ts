import makeUseHeaderEntriesInfoBy from "@hooks/core/activityEntryInfo/makeUseHeaderEntriesInfoBy";
import { makeSelectEntryInfoTotal } from "@selectors/activityEntryInfo/selectEntryInfoTotal";

const selectHeaderEntryInfoTotal = makeSelectEntryInfoTotal();

const useHeaderEntriesInfoTotal = makeUseHeaderEntriesInfoBy(selectHeaderEntryInfoTotal);

export default useHeaderEntriesInfoTotal;
