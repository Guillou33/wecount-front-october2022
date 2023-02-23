import { createSelector } from "reselect";
import mapObject from "@lib/utils/mapObject";

import { RootState } from "@reducers/index";
import { EntriesByCampaign } from "@lib/core/activityEntries/getCampaignsEntryInfoByActivityModel";

import selectCategoriesInCartography from "@selectors/cartography/selectCategoriesInCartography";

import getCampaignsEntryInfoByActivityModel from "@lib/core/activityEntries/getCampaignsEntryInfoByActivityModel";
import getEntryInfoForActivityModelList from "@lib/core/activityEntries/getEntryInfoForActivityModelList";
import { EntryInfo } from "@lib/core/activityEntries/entryInfo";

const makeSelectCampaignsInfoByCategory = () => {
  const selectCampaignsInfoByCategory = createSelector(
    [
      selectCategoriesInCartography,
      (_: RootState, entriesByCampaign: EntriesByCampaign) =>
        getCampaignsEntryInfoByActivityModel(entriesByCampaign),
    ],
    (categories, campaignsEntryInfoByActivityModel) => {
      return mapObject(
        campaignsEntryInfoByActivityModel,
        entryInfoByActivityModel =>
          Object.values(categories).reduce((acc, category) => {
            acc[category.id] = getEntryInfoForActivityModelList(
              category.activityModels,
              entryInfoByActivityModel
            );
            return acc;
          }, {} as Record<number, EntryInfo>)
      );
    }
  );
  return selectCampaignsInfoByCategory;
};

export default makeSelectCampaignsInfoByCategory();

export { makeSelectCampaignsInfoByCategory };
