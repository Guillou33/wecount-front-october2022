import { ActivityEntryReferenceHistory, EntryData } from "@reducers/entries/campaignEntriesReducer";
import { RootState } from "@reducers/index";
import { cleanHistoryList, getHistoryList } from "@selectors/activityEntries/selectReferenceHistory";
import { useMemo } from "react";
import { useSelector } from "react-redux";

export const useIsHistoryEmpty = ({
  campaignId,
  entry,
}: {
  campaignId: number;
  entry: EntryData;
}) => {
  const historyList = useSelector<RootState, ActivityEntryReferenceHistory[]>(state => !entry.id ? [] : getHistoryList(state, {campaignId, entryKey: entry.id.toString()}));
  const cleanedHistoryList = useMemo(() => {
    return cleanHistoryList({list: historyList, entry});
  }, [historyList]);

  return cleanedHistoryList.length === 0;
}