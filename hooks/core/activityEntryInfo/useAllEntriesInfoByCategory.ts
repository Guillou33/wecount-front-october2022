import makeUseAllEntriesInfoBy from "@hooks/core/activityEntryInfo/makeUseAllEntriesInfoBy";
import { makeSelectEntryInfoByCategory } from "@selectors/activityEntryInfo/selectEntryInfoByCategory";

const selectEntryInfoByCategory = makeSelectEntryInfoByCategory();

const useAllEntriesInfoByCategory = makeUseAllEntriesInfoBy(
  selectEntryInfoByCategory
);

export default useAllEntriesInfoByCategory;
