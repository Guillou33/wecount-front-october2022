import makeUseNotExcludedEntriesInfoBy from "@hooks/core/notExcludedActivityEntryInfo/makeUseNotExcludedEntriesInfoBy";
import { makeSelectNotExcludedEntryInfoTotal } from "@selectors/activityEntryInfo/selectNotExcludedEntryInfoTotal";

const selectNotExcludedEntryInfoTotal = makeSelectNotExcludedEntryInfoTotal();

const useNotExcludedEntriesInfoTotal = makeUseNotExcludedEntriesInfoBy(selectNotExcludedEntryInfoTotal);

export default useNotExcludedEntriesInfoTotal;
