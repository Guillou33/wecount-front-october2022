import { createSelector } from "reselect";

import mapObject from "@lib/utils/mapObject";

import { RootState } from "@reducers/index";
import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";

import {
  getSiteInfoByActivityModel,
  getProductInfoByActivityModel,
  EntityInfoByActivityModelGetter,
} from "@lib/core/activityEntries/getEntityInfoByActivityModel";

import selectCategoriesInCartography from "@selectors/cartography/selectCategoriesInCartography";
import getEntryInfoForActivityModelList from "@lib/core/activityEntries/getEntryInfoForActivityModelList";

function makeSelectEntityInfoByCategory(
  getEntityInfoByActivityModel: EntityInfoByActivityModelGetter
) {
  const selectEntityInfoByCategory = createSelector(
    [
      selectCategoriesInCartography,
      (_: RootState, activityEntries: ActivityEntryExtended[]) =>
        getEntityInfoByActivityModel(activityEntries),
    ],
    (categories, sitesInfoByActivityModel) => {
      return mapObject(sitesInfoByActivityModel, siteInfo => {
        return mapObject(categories, category => {
          return getEntryInfoForActivityModelList(
            category.activityModels,
            siteInfo
          );
        });
      });
    }
  );
  return selectEntityInfoByCategory;
}

const selectSiteInfoByCategory = makeSelectEntityInfoByCategory(
  getSiteInfoByActivityModel
);

const selectProductInfoByCategory = makeSelectEntityInfoByCategory(
  getProductInfoByActivityModel
);

export { selectSiteInfoByCategory, selectProductInfoByCategory };
