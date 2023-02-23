import { createSelector } from "reselect";

import selectCartography from "@selectors/cartography/selectCartography";
import getEntryModelInfoByActivityModel from "@lib/core/activityEntries/getEntryInfoByActivityModel";

import mapObject from "@lib/utils/mapObject";

import { RootState } from "@reducers/index";
import { ActivityCategory } from "@reducers/core/categoryReducer";

// Returns the cartography without the archived activity models if they are not used by the campaign
const selectCartographyForCampaign = createSelector(
  [
    selectCartography,
    (state: RootState, campaignId: number) =>
      state.campaignEntries?.[campaignId]?.entries,
  ],
  (cartography, campaignEntries) => {
    const entriesList = Object.entries(campaignEntries ?? {}).map(
      ([key, campaignEntry]) => ({ entryKey: key, ...campaignEntry.entryData })
    );
    const activityModelsUsedByEntries =
      getEntryModelInfoByActivityModel(entriesList);

    const cartographyForCampaign = mapObject(cartography, scope => {
      return Object.values(scope).reduce((acc, category) => {
        const validActivityModels = category.activityModels.filter(
          activityModel => {
            return (
              activityModel.archivedDate === null ||
              activityModelsUsedByEntries[activityModel.id]?.nb > 0
            );
          }
        );
        if (validActivityModels.length > 0) {
          acc[category.id] = {
            ...category,
            activityModels: validActivityModels,
          };
        }
        return acc;
      }, {} as Record<number, ActivityCategory>);
    });

    return cartographyForCampaign;
  }
);

export default selectCartographyForCampaign;
