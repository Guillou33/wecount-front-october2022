import { useSelector } from "react-redux";

import { RootState } from "@reducers/index";
import { EntryData } from "@reducers/entries/campaignEntriesReducer";

import useIsEntryOwner from "./useIsEntryOwner";

function useIsEntryWriter(entry: EntryData): boolean {
  const userId = useSelector<RootState, number | undefined>(
    state => state.auth.id
  );

  const isEntryOwner = useIsEntryOwner(entry);

  if (userId == null) {
    return false;
  }
  if (isEntryOwner) {
    return true;
  }
  return entry.writerId === userId;
}

export default useIsEntryWriter;
