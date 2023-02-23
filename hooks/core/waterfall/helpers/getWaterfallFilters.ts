import { EntriesHistory } from "@lib/core/campaignHistory/getHistoryFromEntries";
import { WaterfallDataName } from "@hooks/core/waterfall/helpers/waterfallData";
import { SiteIdsByCampaignIds } from "@selectors/sites/selectSitesUsedByCampaigns";
import { ProductIdsByCampaignIds } from "@selectors/products/selectProductsUsedByCampaigns";

import { historyChecker } from "@hooks/core/waterfall/helpers/historyChecker";
import { isNewGroup } from "@hooks/core/waterfall/helpers/historyChecker";
import { isOldGroup } from "@hooks/core/waterfall/helpers/historyChecker";
import { isEvolutionGroup } from "@hooks/core/waterfall/helpers/historyChecker";
import getEvolutionOfInputsAndEf from "@hooks/core/waterfall/helpers/getEvolutionOfInputsAndEf";
import getEntryOldOrNewHelpers from "@hooks/core/waterfall/helpers/getEntryOldOrNewHelpers";

type HistoryFilter = (entriesHistory: EntriesHistory) => boolean;
export type WaterfallFilters = {
  [key in WaterfallDataName]: HistoryFilter;
};

type Params = {
  campaignIds: [number, number];
  sitesUsedByCampaigns: SiteIdsByCampaignIds;
  productsUsedByCampaigns: ProductIdsByCampaignIds;
};

function getWaterfallFilters({
  campaignIds,
  sitesUsedByCampaigns,
  productsUsedByCampaigns,
}: Params): WaterfallFilters {
  const [campaignOneId, campaignTwoId] = campaignIds;

  const {
    isEntrySiteOld,
    isEntryProductOld,
    isEntrySiteNew,
    isEntryProductNew,
  } = getEntryOldOrNewHelpers({
    siteIdsOfCampaignOne: sitesUsedByCampaigns[campaignOneId],
    productIdsOfCampaignOne: productsUsedByCampaigns[campaignOneId],
    siteIdsOfCampaignTwo: sitesUsedByCampaigns[campaignTwoId],
    productIdsOfCampaignTwo: productsUsedByCampaigns[campaignTwoId],
  });

  return {
    newSitesOnly: historyChecker({
      campaignOneId,
      campaignTwoId,
      entriesChecker: entries =>
        isNewGroup(entries) &&
        isEntrySiteNew(entries.entry2) &&
        !isEntryProductNew(entries.entry2),
    }),
    newProductsOnly: historyChecker({
      campaignOneId,
      campaignTwoId,
      entriesChecker: entries =>
        isNewGroup(entries) &&
        isEntryProductNew(entries.entry2) &&
        !isEntrySiteNew(entries.entry2),
    }),
    newSitesAndProducts: historyChecker({
      campaignOneId,
      campaignTwoId,
      entriesChecker: entries =>
        isNewGroup(entries) &&
        isEntrySiteNew(entries.entry2) &&
        isEntryProductNew(entries.entry2),
    }),
    otherNewEntries: historyChecker({
      campaignOneId,
      campaignTwoId,
      entriesChecker: entries =>
        isNewGroup(entries) &&
        !isEntrySiteNew(entries.entry2) &&
        !isEntryProductNew(entries.entry2),
    }),
    inputsAugmentations: historyChecker({
      campaignOneId,
      campaignTwoId,
      entriesChecker: entries => {
        if (!isEvolutionGroup(entries)) {
          return false;
        }
        const { entry1, entry2 } = entries;
        const [inputsEvolution] = getEvolutionOfInputsAndEf(entry1, entry2);

        return inputsEvolution > 0;
      },
    }),
    feAugmentations: historyChecker({
      campaignOneId,
      campaignTwoId,
      entriesChecker: entries => {
        if (!isEvolutionGroup(entries)) {
          return false;
        }
        const { entry1, entry2 } = entries;
        const [, evolutionFromEf] = getEvolutionOfInputsAndEf(entry1, entry2);
        return evolutionFromEf > 0;
      },
    }),
    oldSitesOnly: historyChecker({
      campaignOneId,
      campaignTwoId,
      entriesChecker: entries =>
        isOldGroup(entries) &&
        isEntrySiteOld(entries.entry1) &&
        !isEntryProductOld(entries.entry1),
    }),
    oldProductsOnly: historyChecker({
      campaignOneId,
      campaignTwoId,
      entriesChecker: entries =>
        isOldGroup(entries) &&
        isEntryProductOld(entries.entry1) &&
        !isEntrySiteOld(entries.entry1),
    }),
    oldSitesAndProducts: historyChecker({
      campaignOneId,
      campaignTwoId,
      entriesChecker: entries =>
        isOldGroup(entries) &&
        isEntrySiteOld(entries.entry1) &&
        isEntryProductOld(entries.entry1),
    }),
    otherOldEntries: historyChecker({
      campaignOneId,
      campaignTwoId,
      entriesChecker: entries =>
        isOldGroup(entries) &&
        !isEntrySiteOld(entries.entry1) &&
        !isEntryProductOld(entries.entry1),
    }),
    inputsReduction: historyChecker({
      campaignOneId,
      campaignTwoId,
      entriesChecker: entries => {
        if (!isEvolutionGroup(entries)) {
          return false;
        }
        const { entry1, entry2 } = entries;
        const [inputsEvolution] = getEvolutionOfInputsAndEf(entry1, entry2);

        return inputsEvolution < 0;
      },
    }),
    feReduction: historyChecker({
      campaignOneId,
      campaignTwoId,
      entriesChecker: entries => {
        if (!isEvolutionGroup(entries)) {
          return false;
        }
        const { entry1, entry2 } = entries;
        const [, evolutionFromEf] = getEvolutionOfInputsAndEf(entry1, entry2);

        return evolutionFromEf < 0;
      },
    }),
  };
}

export default getWaterfallFilters;
