import { createSelector } from "reselect";
import mapObject from "@lib/utils/mapObject";

import { RootState } from "@reducers/index";

import { EntriesByCampaign } from "@lib/core/activityEntries/getCampaignsEntryInfoByActivityModel";
import selectActivityModelsInCartography from "@selectors/cartography/selectActivityModelsInCartography";

import getCampaignsEntryInfoByActivityModel from "@lib/core/activityEntries/getCampaignsEntryInfoByActivityModel";
import getEntryInfoForActivityModelList from "@lib/core/activityEntries/getEntryInfoForActivityModelList";

const makeSelectCampaignsInfoTotal = () => {
  const selectCampaignsInfoTotal = createSelector(
    [
      selectActivityModelsInCartography,
      (_: RootState, entriesByCampaign: EntriesByCampaign) =>
        getCampaignsEntryInfoByActivityModel(entriesByCampaign),
    ],
    (activityModels, campaignsEntryInfoByActivityModel) => {
      return mapObject(
        campaignsEntryInfoByActivityModel,
        entryInfoByActivityModel =>
          getEntryInfoForActivityModelList(
            activityModels,
            entryInfoByActivityModel
          )
      );
    }
  );
  return selectCampaignsInfoTotal;
};

export default makeSelectCampaignsInfoTotal();

export { makeSelectCampaignsInfoTotal };
