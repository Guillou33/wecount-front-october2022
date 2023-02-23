import makeUseNotExcludedEntriesInfoBy from "@hooks/core/notExcludedActivityEntryInfo/makeUseNotExcludedEntriesInfoBy";
import { makeSelectEntryInfoByScope } from "@selectors/activityEntryInfo/selectEntryInfoByScope";

const selectEntryInfoByScope = makeSelectEntryInfoByScope();

const useNotExcludedEntriesInfoByScope = makeUseNotExcludedEntriesInfoBy(
    selectEntryInfoByScope
);

export default useNotExcludedEntriesInfoByScope;
