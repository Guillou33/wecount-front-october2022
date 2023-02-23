import { createSelector } from "reselect";

import { RootState } from "@reducers/index";
import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";
import { Scope } from "@custom-types/wecount-api/activity";

import selectActivitymodelsInScope from "@selectors/cartography/selectActivitymodelsInScope";

import getEntryInfoByActivityModel from "@lib/core/activityEntries/getEntryInfoByActivityModel";
import getEntryInfoForActivityModelList from "@lib/core/activityEntries/getEntryInfoForActivityModelList";
import { EntryInfo } from "@lib/core/activityEntries/entryInfo";

const makeSelectEntryInfoByScope = () => {
  const selectEntryInfoByScope = createSelector(
    [
      selectActivitymodelsInScope,
      (_: RootState, activityEntries: ActivityEntryExtended[]) =>
        getEntryInfoByActivityModel(activityEntries),
    ],
    (actvityModelsInScope, entryInfoByActivityModel) => {
      return Object.values(Scope).reduce((acc, scope) => {
        acc[scope] = getEntryInfoForActivityModelList(
          actvityModelsInScope[scope],
          entryInfoByActivityModel
        );
        return acc;
      }, {} as Record<Scope, EntryInfo>);
    }
  );
  return selectEntryInfoByScope;
};

export default makeSelectEntryInfoByScope();

export { makeSelectEntryInfoByScope };
