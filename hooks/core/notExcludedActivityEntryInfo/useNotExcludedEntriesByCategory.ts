import makeUseNotExcludedEntriesInfoBy from "@hooks/core/notExcludedActivityEntryInfo/makeUseNotExcludedEntriesInfoBy";
import { makeSelectNotExcludedEntryInfoByCategory } from "@selectors/activityEntryInfo/selectNotExcludedEntryInfoByCategory";

const selectNotExcludedEntryInfoByCategory = makeSelectNotExcludedEntryInfoByCategory();

const useNotExcludedEntriesInfoByCategory = makeUseNotExcludedEntriesInfoBy(
  selectNotExcludedEntryInfoByCategory
);

export default useNotExcludedEntriesInfoByCategory;
