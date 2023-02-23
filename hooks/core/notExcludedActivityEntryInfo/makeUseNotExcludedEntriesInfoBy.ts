import { useSelector } from "react-redux";

import selectActivityEntriesForTrajectory from "@selectors/activityEntries/selectActivityEntriesForTrajectory";

import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";
import { RootState } from "@reducers/index";

function makeUseNotExcludedEntriesInfoBy<T>(
  entryInfoSelector: (state: RootState, entries: ActivityEntryExtended[]) => T
) {
  return function useNotExcludedEntriesInfoByCategory(campaignId: number) {
    const notExcludedEntries = useSelector((state: RootState) =>
      selectActivityEntriesForTrajectory(state, campaignId)
    );

    const notExcludedEntryInfoBy = useSelector((state: RootState) =>
      entryInfoSelector(state, notExcludedEntries)
    );

    return notExcludedEntryInfoBy;
  };
}

export default makeUseNotExcludedEntriesInfoBy;
