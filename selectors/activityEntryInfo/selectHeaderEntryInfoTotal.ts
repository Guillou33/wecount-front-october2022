import { createSelector } from "reselect";

import { RootState } from "@reducers/index";

import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";
import selectActivityModelsInCartography from "@selectors/cartography/selectActivityModelsInCartography";

import getEntryInfoByActivityModel from "@lib/core/activityEntries/getEntryInfoByActivityModel";
import getEntryInfoForActivityModelList from "@lib/core/activityEntries/getEntryInfoForActivityModelList";

const makeSelectEntryInfoTotal = () => {
    const selectEntryInfoTotal = createSelector(
        [
            selectActivityModelsInCartography,
            (_: RootState, activityEntries: ActivityEntryExtended[]) =>
                getEntryInfoByActivityModel(activityEntries),
        ],
        (activityModels, entryInfoByActivityModel) => {
            return getEntryInfoForActivityModelList(
                activityModels,
                entryInfoByActivityModel
            );
        }
    );
    return selectEntryInfoTotal;
};

export default makeSelectEntryInfoTotal();

export { makeSelectEntryInfoTotal };
