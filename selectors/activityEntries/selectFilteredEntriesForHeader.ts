import { createSelector } from "reselect";

import { RootState } from "@reducers/index";

import selectActivityEntriesOfCampaign from "@selectors/activityEntries/selectActivityEntriesOfCampaign";
import selectNotExcludedFilter from "@selectors/filters/selectNotExcludedFilter";

import { FilterNames } from "@reducers/filters/filtersReducer";

const selectFilteredActivityEntriesForHeader = createSelector(
    [
        (state: RootState, campaignId: number) =>
            selectActivityEntriesOfCampaign(state, campaignId),
        (state: RootState) =>
            selectNotExcludedFilter(state, FilterNames.CARTOGRAPHY_EXCLUDED),
    ],
    (
        entries,
        selectedNotExcluded,
    ) => {
        return entries.filter(entry => {

            const notExcludedMatches = () =>
                selectedNotExcluded === 1 ?
                    !entry.isExcludedFromTrajectory :
                    selectedNotExcluded === 2 ?
                        entry.isExcludedFromTrajectory :
                        selectedNotExcluded === 3 ? entry : {};

            return (
                notExcludedMatches()
            );
        });
    }
);

export default selectFilteredActivityEntriesForHeader;
