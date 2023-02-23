import { createSelector } from "reselect";
import mapObject from "@lib/utils/mapObject";

import { RootState } from "@reducers/index";
import { Scope } from "@custom-types/wecount-api/activity";
import { EntriesByCampaign } from "@lib/core/activityEntries/getCampaignsEntryInfoByActivityModel";

import selectActivitymodelsInScope from "@selectors/cartography/selectActivitymodelsInScope";

import getCampaignsEntryInfoByActivityModel from "@lib/core/activityEntries/getCampaignsEntryInfoByActivityModel";
import getEntryInfoForActivityModelList from "@lib/core/activityEntries/getEntryInfoForActivityModelList";
import { EntryInfo } from "@lib/core/activityEntries/entryInfo";

const makeSelectCampaignsInfoByScope = () => {
  const selectCampaignsInfoByScope = createSelector(
    [
      selectActivitymodelsInScope,
      (_: RootState, entriesByCampaign: EntriesByCampaign) =>
        getCampaignsEntryInfoByActivityModel(entriesByCampaign),
    ],
    (actvityModelsInScope, campaignsEntryInfoByActivityModel) => {
      return mapObject(
        campaignsEntryInfoByActivityModel,
        entryInfoByActivityModel =>
          Object.values(Scope).reduce((acc, scope) => {
            acc[scope] = getEntryInfoForActivityModelList(
              actvityModelsInScope[scope],
              entryInfoByActivityModel
            );
            return acc;
          }, {} as Record<Scope, EntryInfo>)
      );
    }
  );
  return selectCampaignsInfoByScope;
};

export default makeSelectCampaignsInfoByScope();

export { makeSelectCampaignsInfoByScope };
