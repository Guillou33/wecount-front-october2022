import { ActivityEntryReferenceHistory, EntryData } from "@reducers/entries/campaignEntriesReducer";
import { RootState } from "@reducers/index";
import { cleanHistoryList, getHistoryList } from "@selectors/activityEntries/selectReferenceHistory";
import { useMemo } from "react";
import { useSelector } from "react-redux";

export const useLastActivityEntryFromHistory = ({
  campaignId,
  entryKey,
  entry,
}: {
  campaignId: number;
  entryKey: string;
  entry: EntryData;
}) => {
  const campaignYear = useSelector<RootState, number>(
    state => state.campaign.campaigns[campaignId]!.information!.year
  );
  const historyList = useSelector<RootState, ActivityEntryReferenceHistory[]>(state => getHistoryList(state, {campaignId, entryKey}));
  const lastActivityEntryFromHistory = useMemo(() => {
    const cleanedHistoryList = cleanHistoryList({list: historyList, entry});
    const youngerHistoryList = cleanedHistoryList.filter(ae => ae.campaignYear < campaignYear);
    return youngerHistoryList.length ? youngerHistoryList[youngerHistoryList.length - 1] : undefined;
  }, [historyList]);

  return lastActivityEntryFromHistory;
}