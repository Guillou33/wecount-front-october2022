import { isEmpty } from "lodash";
import { createSelector } from "reselect";

import mapObject from "@lib/utils/mapObject";

import { RootState } from "@reducers/index";
import { EntriesByCampaign } from "@lib/core/activityEntries/getCampaignsEntryInfoByActivityModel";

import selectNotExcludedFilter from "@selectors/filters/selectNotExcludedFilter";
import selectPresenceHashMapFilter from "@selectors/filters/selectPresenceMapFilter";
import selectSearchableFilter from "@selectors/filters/selectSearchableFilter";

import { FilterNames } from "@reducers/filters/filtersReducer";

const selectFilteredEntriesOfMultipleCampaignsForAnalysis = createSelector(
  [
    (_: RootState, entriesByCampaignId: EntriesByCampaign) =>
      entriesByCampaignId,
    (state: RootState) =>
      selectNotExcludedFilter(state, FilterNames.CARTOGRAPHY_EXCLUDED),
    (state: RootState) =>
      selectSearchableFilter(state, FilterNames.CARTOGRAPHY_SITES).elementIds,
    (state: RootState) =>
      selectSearchableFilter(state, FilterNames.CARTOGRAPHY_PRODUCTS)
        .elementIds,
    (state: RootState) =>
      selectSearchableFilter(state, FilterNames.CARTOGRAPHY_ENTRY_TAGS)
        .elementIds,
  ],
  (
    entriesByCampaignId,
    selectedNotExcluded,
    selectedSites,
    selectedProducts,
    selectedEntryTags
  ): EntriesByCampaign => {
    return mapObject(entriesByCampaignId, entries =>
      entries.filter(entry => {
        const notExcludedMatches = () =>
          selectedNotExcluded === 1
            ? !entry.isExcludedFromTrajectory
            : selectedNotExcluded === 2
            ? entry.isExcludedFromTrajectory
            : selectedNotExcluded === 3
            ? entry
            : {};

        const siteMatches = () =>
          isEmpty(selectedSites) || selectedSites[entry.siteId ?? -1];

        const productMatches = () =>
          isEmpty(selectedProducts) || selectedProducts[entry.productId ?? -1];

        const entryTagsMatches = () => {
          const tagsOnEntry =
            entry.entryTagIds.length === 0 ? [-1] : entry.entryTagIds;
          return (
            isEmpty(selectedEntryTags) ||
            tagsOnEntry.some(tagId => selectedEntryTags[tagId])
          );
        };

        return (
          notExcludedMatches() &&
          siteMatches() &&
          productMatches() &&
          entryTagsMatches()
        );
      })
    );
  }
);

export default selectFilteredEntriesOfMultipleCampaignsForAnalysis;
