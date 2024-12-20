import makeUseNotExcludedEntriesInfoBy from "@hooks/core/notExcludedActivityEntryInfo/makeUseNotExcludedEntriesInfoBy";
import { makeSelectNotExcludedEntryInfoBySiteWithSubSites } from "@selectors/activityEntryInfo/selectNotExcludedEntryInfoBySiteWithSubSites";

const selectNotExcludedEntryInfoBySiteWithSubSites = makeSelectNotExcludedEntryInfoBySiteWithSubSites();

const useNotExcludedEntriesInfoBySiteWithSubSites = makeUseNotExcludedEntriesInfoBy(
    selectNotExcludedEntryInfoBySiteWithSubSites
);

export default useNotExcludedEntriesInfoBySiteWithSubSites;
