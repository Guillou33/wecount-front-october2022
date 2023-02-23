import { useSelector } from "react-redux";

import { RootState } from "@reducers/index";
import { EntryData } from "@reducers/entries/campaignEntriesReducer";

function useIsEntryWriterStrictly(entry: EntryData): boolean {
  const userId = useSelector<RootState, number | undefined>(
    state => state.auth.id
  );

  if (userId == null) {
    return false;
  }
  return entry.writerId === userId;
}

export default useIsEntryWriterStrictly;
