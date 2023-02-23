import { createSelector } from "reselect";

import { RootState } from "@reducers/index";

import selectActivityModelsInCartography from "@selectors/cartography/selectActivityModelsInCartography";

import { EntryData } from "@reducers/entries/campaignEntriesReducer";

export type ActivityEntryExtended = EntryData & { entryKey: string };

const selectActivityEntriesForTrajectory = createSelector(
    [
        (state: RootState, campaignId: number) =>
            state.campaignEntries[campaignId]?.entries,
        selectActivityModelsInCartography,
    ],

    (entries, visibleActivityModels): ActivityEntryExtended[] => {
        const visibleActivityModelsRecord = visibleActivityModels.reduce(
            (acc, activityModel) => {
                acc[activityModel.id] = true;
                return acc;
            },
            {} as Record<number, true>
        );
        return Object.entries(entries ?? {})
            .map(([key, entry]) => {
                return {
                    ...entry.entryData,
                    entryKey: key,
                };
            })
            .filter(entry => !entry.isExcludedFromTrajectory)
            .filter(entry => visibleActivityModelsRecord[entry.activityModelId]);
    }
);

export default selectActivityEntriesForTrajectory;
