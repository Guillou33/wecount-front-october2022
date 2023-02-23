import { useSelector } from "react-redux";

import selectFilteredActivityEntriesForUsers from "@selectors/activityEntries/selectFilteredActivityEntriesForUsers";

import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";
import { RootState } from "@reducers/index";

function makeUseUsersEntriesInfoBy<T>(
  entryInfoSelector: (state: RootState, entries: ActivityEntryExtended[]) => T
) {
  return function useAllEntriesInfoByUser(campaignId: number) {
    const allEntries = useSelector((state: RootState) =>
        selectFilteredActivityEntriesForUsers(state, campaignId)
    );

    const allEntryInfoBy = useSelector((state: RootState) =>
      entryInfoSelector(state, allEntries)
    );

    return allEntryInfoBy;
  };
}

export default makeUseUsersEntriesInfoBy;
