import makeUseNotExcludedEntriesInfoBy from "@hooks/core/notExcludedActivityEntryInfo/makeUseNotExcludedEntriesInfoBy";
import { makeSelectNotExcludedEntryInfoBySite } from "@selectors/activityEntryInfo/selectNotExcludedEntryInfoBySite";

const selectNotExcludedEntryInfoBySite = makeSelectNotExcludedEntryInfoBySite();

const useNotExcludedEntriesInfoBySite = makeUseNotExcludedEntriesInfoBy(
    selectNotExcludedEntryInfoBySite
);

export default useNotExcludedEntriesInfoBySite;
