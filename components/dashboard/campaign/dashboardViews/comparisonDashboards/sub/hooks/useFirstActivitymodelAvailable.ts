import { useSelector } from "react-redux";

import { RootState } from "@reducers/index";

import sortScope from "@lib/core/scopes/sortScopes";

import selectEntryInfoByActivityModel from "@selectors/activityEntryInfo/selectEntryInfoByActivityModel";
import selectFilteredActivityEntriesForAnalysis from "@selectors/activityEntries/selectFilteredActivityEntriesForAnalysis";
import selectCategoriesInCartographyForCampaign from "@selectors/cartography/selectCategoriesInCartographyForCampaign";

function useFirstActivityModelAvailableId(campaignId: number): number {
  const filteredEntriesOfCampaigns = useSelector((state: RootState) =>
    selectFilteredActivityEntriesForAnalysis(state, campaignId)
  );
  const entryInfoByActivityModel = useSelector((state: RootState) =>
    selectEntryInfoByActivityModel(state, filteredEntriesOfCampaigns)
  );

  const categoriesInCartography = useSelector((state: RootState) =>
    selectCategoriesInCartographyForCampaign(state, campaignId)
  );

  const sortedCategories = Object.values(categoriesInCartography).sort(
    (catA, catB) => sortScope(catA.scope, catB.scope)
  );

  const activityModels = sortedCategories.flatMap(category => category.activityModels);

  const firstActivityModelAvailable = activityModels.find(
    activitymodel => {
      return (entryInfoByActivityModel[activitymodel.id]?.nb ?? -1) > 0;
    }
  );

  return firstActivityModelAvailable?.id ?? -1;
}

export default useFirstActivityModelAvailableId;
