import { createSelector } from "reselect";

import { RootState } from "@reducers/index";

import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";
import selectActivityModelsInCartography from "@selectors/cartography/selectActivityModelsInCartography";

import getEntryInfoByActivityModel from "@lib/core/activityEntries/getEntryInfoByActivityModel";
import getEntryInfoForActivityModelList from "@lib/core/activityEntries/getEntryInfoForActivityModelList";

const makeSelectNotExcludedEntryInfoTotal = () => {
    const selectNotExcludedEntryInfoTotal = createSelector(
        [
            selectActivityModelsInCartography,
            (_: RootState, activityEntries: ActivityEntryExtended[]) =>
                getEntryInfoByActivityModel(activityEntries.filter(entry => !entry.isExcludedFromTrajectory)),
        ],
        (activityModels, entryInfoByActivityModel) => {
            return getEntryInfoForActivityModelList(
                activityModels,
                entryInfoByActivityModel
            );
        }
    );
    return selectNotExcludedEntryInfoTotal;
};

export default makeSelectNotExcludedEntryInfoTotal();

export { makeSelectNotExcludedEntryInfoTotal };
