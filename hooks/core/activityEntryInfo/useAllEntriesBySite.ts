import makeUseAllEntriesInfoBy from "@hooks/core/activityEntryInfo/makeUseAllEntriesInfoBy";
import selectEntryInfoBySite from "@selectors/activityEntryInfo/selectEntryInfoBySite";

// const selectEntryInfoByActivityModel = makeSelectEntryInfoByActivityModel();

const useAllEntriesInfoBySite = makeUseAllEntriesInfoBy(
    selectEntryInfoBySite
);

export default useAllEntriesInfoBySite;
