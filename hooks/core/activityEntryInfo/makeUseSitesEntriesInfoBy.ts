import { useSelector } from "react-redux";

import selectFilteredActivityEntriesForSites from "@selectors/activityEntries/selectFilteredActivityEntriesForSites";

import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";
import { RootState } from "@reducers/index";

function makeUseSitesEntriesInfoBy<T>(
  entryInfoSelector: (state: RootState, entries: ActivityEntryExtended[]) => T
) {
  return function useAllEntriesInfoBySite(campaignId: number) {
    const allEntries = useSelector((state: RootState) =>
        selectFilteredActivityEntriesForSites(state, campaignId)
    );

    const allEntryInfoBy = useSelector((state: RootState) =>
      entryInfoSelector(state, allEntries)
    );

    return allEntryInfoBy;
  };
}

export default makeUseSitesEntriesInfoBy;
