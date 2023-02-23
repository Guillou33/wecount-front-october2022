import { useSelector } from "react-redux";

import selectActivityEntriesOfCampaign from "@selectors/activityEntries/selectActivityEntriesOfCampaign";

import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";
import { RootState } from "@reducers/index";

function makeUseAllEntriesInfoBy<T>(
  entryInfoSelector: (state: RootState, entries: ActivityEntryExtended[]) => T
) {
  return function useAllEntriesInfoByCategory(campaignId: number) {
    const allEntries = useSelector((state: RootState) =>
      selectActivityEntriesOfCampaign(state, campaignId)
    );

    const allEntryInfoBy = useSelector((state: RootState) =>
      entryInfoSelector(state, allEntries)
    );

    return allEntryInfoBy;
  };
}

export default makeUseAllEntriesInfoBy;
