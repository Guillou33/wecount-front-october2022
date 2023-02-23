import { createSelector } from "reselect";

import mapObject from "@lib/utils/mapObject";

import { RootState } from "@reducers/index";
import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";

import selectActivityModelsInCartography from "@selectors/cartography/selectActivityModelsInCartography";

import {
  getSiteInfoByActivityModel,
  getProductInfoByActivityModel,
  EntityInfoByActivityModelGetter,
} from "@lib/core/activityEntries/getEntityInfoByActivityModel";

import {
  EntryInfo,
  getInitialEntryInfo,
} from "@lib/core/activityEntries/entryInfo";

function makeSelectEntityInfoByActivityModel(
  getEntityInfoByActivityModel: EntityInfoByActivityModelGetter
) {
  const selectEntityInfoByActivityModel = createSelector(
    [
      selectActivityModelsInCartography,
      (_: RootState, activityEntries: ActivityEntryExtended[]) =>
        getEntityInfoByActivityModel(activityEntries),
    ],
    (activityModels, entityInfoByActivityModel) => {
      return mapObject(entityInfoByActivityModel, entityInfo => {
        return activityModels.reduce((acc, activityModel) => {
          acc[activityModel.id] =
            entityInfo[activityModel.id] ?? getInitialEntryInfo();
          return acc;
        }, {} as Record<number, EntryInfo>);
      });
    }
  );
  return selectEntityInfoByActivityModel;
}

const selectSiteInfoByActivityModel = makeSelectEntityInfoByActivityModel(
  getSiteInfoByActivityModel
);

const selectProductInfoByActivityModel = makeSelectEntityInfoByActivityModel(
  getProductInfoByActivityModel
);

export { selectSiteInfoByActivityModel, selectProductInfoByActivityModel };
