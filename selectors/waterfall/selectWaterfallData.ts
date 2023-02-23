import { createSelector } from "reselect";

import { RootState } from "@reducers/index";
import { EntriesByCampaign } from "@lib/core/activityEntries/getCampaignsEntryInfoByActivityModel";
import { WaterfallData } from "@hooks/core/waterfall/helpers/waterfallData";

import selectSitesUsedByCampaigns from "@selectors/sites/selectSitesUsedByCampaigns";
import selectProductsUsedByCampaigns from "@selectors/products/selectProductsUsedByCampaigns";
import selectFilteredEntriesOfMultipleCampaignsForAnalysis from "@selectors/activityEntries/selectFilteredEntriesOfMultipleCampaignsForAnalysis";

import getWaterfallFilters from "@hooks/core/waterfall/helpers/getWaterfallFilters";
import { getInitialWaterfallData } from "@hooks/core/waterfall/helpers/waterfallData";
import getEvolutionOfInputsAndEf from "@hooks/core/waterfall/helpers/getEvolutionOfInputsAndEf";
import { getEntryGroup } from "@hooks/core/waterfall/helpers/historyChecker";
import getHistoryFromEntries from "@lib/core/campaignHistory/getHistoryFromEntries";

const dataNameBasedOnEntryDifference = [
  "newSitesOnly",
  "newProductsOnly",
  "newSitesAndProducts",
  "otherNewEntries",
  "oldSitesOnly",
  "oldProductsOnly",
  "oldSitesAndProducts",
  "otherOldEntries",
] as const;

const selectWaterfallData = createSelector(
  [
    (_: RootState, campaignIds: [number, number]) => campaignIds,
    selectSitesUsedByCampaigns,
    selectProductsUsedByCampaigns,
    (
      state: RootState,
      _: [number, number],
      entriesByCampaign: EntriesByCampaign
    ) =>
      selectFilteredEntriesOfMultipleCampaignsForAnalysis(
        state,
        entriesByCampaign
      ),
  ],
  (
    campaignIds,
    sitesUsedByCampaigns,
    productsUsedByCampaigns,
    entriesByCampaign
  ): WaterfallData => {
    const [campaignOneId, campaignTwoId] = campaignIds;

    const waterfallFilters = getWaterfallFilters({
      campaignIds,
      sitesUsedByCampaigns,
      productsUsedByCampaigns,
    });

    const comparisonHistory = getHistoryFromEntries(entriesByCampaign);

    return Object.values(comparisonHistory).reduce(
      (acc: WaterfallData, history) => {
        const entryOfCampaignOne = history.entriesBycampaignId[campaignOneId];
        const entryOfCampaignTwo = history.entriesBycampaignId[campaignTwoId];

        const entryDifference = Math.abs(
          (entryOfCampaignOne?.resultTco2 ?? 0) -
            (entryOfCampaignTwo?.resultTco2 ?? 0)
        );

        const dataNameToAddTo = dataNameBasedOnEntryDifference.find(dataName =>
          waterfallFilters[dataName](history)
        );
        if (dataNameToAddTo != null) {
          acc[dataNameToAddTo] += entryDifference;
          return acc;
        } else {
          const { entry1, entry2 } = getEntryGroup(
            history,
            campaignOneId,
            campaignTwoId
          );
          const [inputsEvolution, feEvolution] = getEvolutionOfInputsAndEf(
            entry1,
            entry2
          );

          if (waterfallFilters.feAugmentations(history)) {
            acc.feAugmentations += feEvolution;
          }
          if (waterfallFilters.inputsAugmentations(history)) {
            acc.inputsAugmentations += inputsEvolution;
          }
          if (waterfallFilters.feReduction(history)) {
            acc.feReduction += -feEvolution;
          }
          if (waterfallFilters.inputsReduction(history)) {
            acc.inputsReduction += -inputsEvolution;
          }
        }

        return acc;
      },
      getInitialWaterfallData()
    );
  }
);

export default selectWaterfallData;
