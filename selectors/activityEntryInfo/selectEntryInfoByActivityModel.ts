import { createSelector } from "reselect";

import { RootState } from "@reducers/index";

import getEntryInfoByActivityModel from "@lib/core/activityEntries/getEntryInfoByActivityModel";
import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";
import {
  EntryInfo,
  getInitialEntryInfo,
} from "@lib/core/activityEntries/entryInfo";

import selectActivityModelsInCartography from "@selectors/cartography/selectActivityModelsInCartography";

const selectEntryInfoByActivityModel = createSelector(
  [
    selectActivityModelsInCartography,
    (_: RootState, activityEntries: ActivityEntryExtended[]) =>
      getEntryInfoByActivityModel(activityEntries),
  ],
  (visibleActivityModels, entryInfoByAllActivityModel) => {
    return Object.values(visibleActivityModels).reduce((acc, activityModel) => {
      acc[activityModel.id] =
        entryInfoByAllActivityModel[activityModel.id] ?? getInitialEntryInfo();
      return acc;
    }, {} as Record<number, EntryInfo>);
  }
);

export default selectEntryInfoByActivityModel;

