import makeUseAllEntriesInfoBy from "@hooks/core/activityEntryInfo/makeUseAllEntriesInfoBy";
import selectEntryInfoByActivityModel from "@selectors/activityEntryInfo/selectEntryInfoByActivityModel";

// const selectEntryInfoByActivityModel = makeSelectEntryInfoByActivityModel();

const useAllEntriesInfoByActivityModel = makeUseAllEntriesInfoBy(
    selectEntryInfoByActivityModel
);

export default useAllEntriesInfoByActivityModel;
