import { createSelector } from "reselect";
import { isEmpty } from "lodash";

import { RootState } from "@reducers/index";

import selectActivityEntriesOfCampaign from "@selectors/activityEntries/selectActivityEntriesOfCampaign";
import selectNotExcludedFilter from "@selectors/filters/selectNotExcludedFilter";
import selectSearchableFilter from "@selectors/filters/selectSearchableFilter";

import { FilterNames } from "@reducers/filters/filtersReducer";

const makeSelectFilteredActivityEntriesForAnalysis = () =>
  createSelector(
    [
      (state: RootState, campaignId: number) =>
        selectActivityEntriesOfCampaign(state, campaignId),
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
      entries,
      selectedNotExcluded,
      selectedSites,
      selectedProducts,
      selectedEntryTags
    ) => {
      return entries.filter(entry => {
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
      });
    }
  );

export default makeSelectFilteredActivityEntriesForAnalysis();

export { makeSelectFilteredActivityEntriesForAnalysis };
