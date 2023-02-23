import { createSelector } from "reselect";

import mapObject from "@lib/utils/mapObject";

import { RootState } from "@reducers/index";
import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";
import { Scope } from "@custom-types/wecount-api/activity";

import selectActivitymodelsInScope from "@selectors/cartography/selectActivitymodelsInScope";

import {
  getSiteInfoByActivityModel,
  getProductInfoByActivityModel,
  EntityInfoByActivityModelGetter,
} from "@lib/core/activityEntries/getEntityInfoByActivityModel";
import getEntryInfoForActivityModelList from "@lib/core/activityEntries/getEntryInfoForActivityModelList";
import { EntryInfo } from "@lib/core/activityEntries/entryInfo";

function makeSelectEntityInfoByScope(
  getEntityInfoByActivityModel: EntityInfoByActivityModelGetter
) {
  const selectEntityInfoByScope = createSelector(
    [
      selectActivitymodelsInScope,
      (_: RootState, activityEntries: ActivityEntryExtended[]) =>
        getEntityInfoByActivityModel(activityEntries),
    ],
    (activityModelInScope, sitesInfoByActivityModel) => {
      return mapObject(sitesInfoByActivityModel, siteInfo => {
        return Object.values(Scope).reduce((acc, scope) => {
          acc[scope] = getEntryInfoForActivityModelList(
            activityModelInScope[scope],
            siteInfo
          );
          return acc;
        }, {} as Record<Scope, EntryInfo>);
      });
    }
  );
  return selectEntityInfoByScope;
}

const selectSiteInfoByScope = makeSelectEntityInfoByScope(
  getSiteInfoByActivityModel
);

const selectProductInfoByScope = makeSelectEntityInfoByScope(
  getProductInfoByActivityModel
);

export { selectSiteInfoByScope, selectProductInfoByScope };
