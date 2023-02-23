import { createSelector } from "reselect";

import { RootState } from "@reducers/index";
import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";

import selectCategoriesInCartography from "@selectors/cartography/selectCategoriesInCartography";
import getEntryInfoByActivityModel from "@lib/core/activityEntries/getEntryInfoByActivityModel";
import getEntryInfoForActivityModelList from "@lib/core/activityEntries/getEntryInfoForActivityModelList";
import { EntryInfo } from "@lib/core/activityEntries/entryInfo";

const makeSelectEntryInfoByCategory = () => {
  const selectEntryInfoByCategory = createSelector(
    [
      selectCategoriesInCartography,
      (_: RootState, activityEntries: ActivityEntryExtended[]) =>
        getEntryInfoByActivityModel(activityEntries),
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
  return selectEntryInfoByCategory;
};

export default makeSelectEntryInfoByCategory();

export { makeSelectEntryInfoByCategory };
