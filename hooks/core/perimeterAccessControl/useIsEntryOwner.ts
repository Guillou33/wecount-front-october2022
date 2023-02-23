import { useSelector } from "react-redux";
import { RootState } from "@reducers/index";

import { EntryData } from "@reducers/entries/campaignEntriesReducer";

function useIsEntryOwner(entry: EntryData): boolean {
  const userId = useSelector<RootState, number | undefined>(
    state => state.auth.id
  );

  return userId == null ? false : userId === entry.ownerId;
}

export default useIsEntryOwner;
