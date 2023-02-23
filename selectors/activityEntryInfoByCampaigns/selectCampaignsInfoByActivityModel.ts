import { createSelector } from "reselect";
import mapObject from "@lib/utils/mapObject";

import { RootState } from "@reducers/index";
import { EntriesByCampaign } from "@lib/core/activityEntries/getCampaignsEntryInfoByActivityModel";
import {
  EntryInfo,
  getInitialEntryInfo,
} from "@lib/core/activityEntries/entryInfo";

import selectActivityModelsInCartography from "@selectors/cartography/selectActivityModelsInCartography";
import getCampaignsEntryInfoByActivityModel from "@lib/core/activityEntries/getCampaignsEntryInfoByActivityModel";

const selectCampaignsInfoByActivityModel = createSelector(
  [
    selectActivityModelsInCartography,
    (_: RootState, entriesByCampaign: EntriesByCampaign) =>
      getCampaignsEntryInfoByActivityModel(entriesByCampaign),
  ],
  (activityModels, campaignsEntryInfoByActivityModel) => {
    return mapObject(
      campaignsEntryInfoByActivityModel,
      entryInfoByActivityModel => {
        return activityModels.reduce((acc, activityModel) => {
          acc[activityModel.id] =
            entryInfoByActivityModel[activityModel.id] ?? getInitialEntryInfo();
          return acc;
        }, {} as Record<number, EntryInfo>);
      }
    );
  }
);

export default selectCampaignsInfoByActivityModel;
