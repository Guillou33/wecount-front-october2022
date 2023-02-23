import { EmissionFactor } from "@reducers/core/emissionFactorReducer";
import { ActivityEntryReferenceHistory, EntryData } from "@reducers/entries/campaignEntriesReducer";
import { RootState } from "@reducers/index";
import { cleanHistoryList, getHistoryList } from "@selectors/activityEntries/selectReferenceHistory";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useIsHistoryEmpty } from "./useIsHistoryEmpty";

export const useIsEntryLockedByHistory = ({
  campaignId,
  entry,
}: {
  campaignId: number;
  entry: EntryData;
}) => {
  const isHistoryEmpty = useIsHistoryEmpty({
    campaignId,
    entry,
  });

  return !isHistoryEmpty;
}