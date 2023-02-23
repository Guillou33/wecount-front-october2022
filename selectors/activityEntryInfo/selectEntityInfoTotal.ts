import { createSelector } from "reselect";

import mapObject from "@lib/utils/mapObject";

import { RootState } from "@reducers/index";
import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";

import selectActivityModelsInCartography from "@selectors/cartography/selectActivityModelsInCartography";

import {
  getSiteInfoByActivityModel,
  getProductInfoByActivityModel,
  getOwnerInfoByActivityModel,
  EntityInfoByActivityModelGetter,
} from "@lib/core/activityEntries/getEntityInfoByActivityModel";
import getEntryInfoForActivityModelList from "@lib/core/activityEntries/getEntryInfoForActivityModelList";

function makeSelectEntityInfoTotal(
  getEntityInfoByActivityModel: EntityInfoByActivityModelGetter
) {
  const selectEntityInfoTotal = createSelector(
    [
      selectActivityModelsInCartography,
      (_: RootState, activityEntries: ActivityEntryExtended[]) =>
        getEntityInfoByActivityModel(activityEntries),
    ],
    (activityModels, sitesInfoByActivityModel) => {
      return mapObject(sitesInfoByActivityModel, siteInfo => {
        return getEntryInfoForActivityModelList(activityModels, siteInfo);
      });
    }
  );
  return selectEntityInfoTotal;
}

const selectSiteInfoTotal = makeSelectEntityInfoTotal(
  getSiteInfoByActivityModel
);

const selectProductInfoTotal = makeSelectEntityInfoTotal(
  getProductInfoByActivityModel
);

const selectOwnerInfoTotal = makeSelectEntityInfoTotal(
  getOwnerInfoByActivityModel
);

export {
  selectSiteInfoTotal,
  selectProductInfoTotal,
  selectOwnerInfoTotal,
  makeSelectEntityInfoTotal,
};
