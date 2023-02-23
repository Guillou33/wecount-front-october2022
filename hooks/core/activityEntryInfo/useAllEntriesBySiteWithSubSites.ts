import makeUseAllEntriesInfoBy from "@hooks/core/activityEntryInfo/makeUseAllEntriesInfoBy";
import selectEntryInfoBySiteWithSubSites from "@selectors/activityEntryInfo/selectEntryInfoBySiteWithSubSites";

// const selectEntryInfoByActivityModel = makeSelectEntryInfoByActivityModel();

const useAllEntriesInfoBySiteWithSubSites = makeUseAllEntriesInfoBy(
    selectEntryInfoBySiteWithSubSites
);

export default useAllEntriesInfoBySiteWithSubSites;
