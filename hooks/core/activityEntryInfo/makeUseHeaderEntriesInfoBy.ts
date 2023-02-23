import { useSelector } from "react-redux";

import selectFilteredActivityEntriesForHeader from "@selectors/activityEntries/selectFilteredEntriesForHeader";

import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";
import { RootState } from "@reducers/index";

function makeUseHeaderEntriesInfoBy<T>(
    entryInfoSelector: (state: RootState, entries: ActivityEntryExtended[]) => T
) {
    return function useAllEntriesInfoByCategory(campaignId: number) {
        const allEntries = useSelector((state: RootState) =>
            selectFilteredActivityEntriesForHeader(state, campaignId)
        );

        const allEntryInfoBy = useSelector((state: RootState) =>
            entryInfoSelector(state, allEntries)
        );

        return allEntryInfoBy;
    };
}

export default makeUseHeaderEntriesInfoBy;
