import { createSelector } from "reselect";

import { RootState } from "@reducers/index";
import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";

import selectCategoriesInCartography from "@selectors/cartography/selectCategoriesInCartography";
import getEntryInfoByActivityModel from "@lib/core/activityEntries/getEntryInfoByActivityModel";
import getEntryInfoForActivityModelList from "@lib/core/activityEntries/getEntryInfoForActivityModelList";
import { EntryInfo } from "@lib/core/activityEntries/entryInfo";

const makeSelectNotExcludedEntryInfoByCategory = () => {
  const selectNotExcludedEntryInfoByCategory = createSelector(
    [
      selectCategoriesInCartography,
      (_: RootState, activityEntries: ActivityEntryExtended[]) =>
        getEntryInfoByActivityModel(activityEntries.filter(entry => !entry.isExcludedFromTrajectory)),
    ],
    (categories, entryInfoByActivityModel) => {
      return Object.values(categories).reduce((acc, category) => {
        acc[category.id] = getEntryInfoForActivityModelList(
          category.activityModels,
          entryInfoByActivityModel
        );
        return acc;
      }, {} as Record<number, EntryInfo>);
    }
  );
  return selectNotExcludedEntryInfoByCategory;
};

export default makeSelectNotExcludedEntryInfoByCategory();

export { makeSelectNotExcludedEntryInfoByCategory };
