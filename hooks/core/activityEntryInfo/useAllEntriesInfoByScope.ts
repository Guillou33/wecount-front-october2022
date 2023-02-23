import makeUseAllEntriesInfoBy from "@hooks/core/activityEntryInfo/makeUseAllEntriesInfoBy";
import { makeSelectEntryInfoByScope } from "@selectors/activityEntryInfo/selectEntryInfoByScope";

const selectEntryInfoByScope = makeSelectEntryInfoByScope();

const useAllEntriesInfoByScope = makeUseAllEntriesInfoBy(
  selectEntryInfoByScope
);

export default useAllEntriesInfoByScope;
