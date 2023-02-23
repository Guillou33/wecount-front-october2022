import { useSelector } from "react-redux";

import selectFilteredActivityEntriesForAnalysis from "@selectors/activityEntries/selectFilteredActivityEntriesForAnalysis";

import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";
import { RootState } from "@reducers/index";

function makeUseTrajectoryDashboardEntriesInfoBy<T>(
  entryInfoSelector: (state: RootState, entries: ActivityEntryExtended[]) => T
) {
  return function useAllEntriesInfoByCategory(campaignId: number) {
    const allEntries = useSelector((state: RootState) =>
      selectFilteredActivityEntriesForAnalysis(state, campaignId)
    );

    const allEntryInfoBy = useSelector((state: RootState) =>
      entryInfoSelector(state, allEntries)
    );

    return allEntryInfoBy;
  };
}

export default makeUseTrajectoryDashboardEntriesInfoBy;
