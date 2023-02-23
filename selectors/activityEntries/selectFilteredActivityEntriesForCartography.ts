import { createSelector } from "reselect";
import { isEmpty } from "lodash";

import { RootState } from "@reducers/index";

import selectActivityEntriesOfCampaign from "@selectors/activityEntries/selectActivityEntriesOfCampaign";
import selectNotExcludedFilter from "@selectors/filters/selectNotExcludedFilter";
import selectSearchableFilter from "@selectors/filters/selectSearchableFilter";
import selectPresenceHashMapFilter from "@selectors/filters/selectPresenceMapFilter";
import selectStatusFilter from "@selectors/filters/selectStatusFilter";
import selectUserDataFilter from "@selectors/filters/selectUserDataFilter";

import { FilterNames } from "@reducers/filters/filtersReducer";

const selectFilteredActivityEntriesForCartography = createSelector(
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
      selectStatusFilter(state, FilterNames.CARTOGRAPHY_STATUSES),
    (state: RootState) =>
      selectSearchableFilter(state, FilterNames.CARTOGRAPHY_EMISSION_FACTORS)
        .elementIds,
    (state: RootState) =>
      selectUserDataFilter(state, FilterNames.CARTOGRAPHY_USER_DATA),
    (state: RootState) =>
      selectPresenceHashMapFilter(state, FilterNames.CARTOGRAPHY_WRITER),
    (state: RootState) =>
      selectPresenceHashMapFilter(state, FilterNames.CARTOGRAPHY_OWNER),
    (state: RootState) =>
      selectSearchableFilter(state, FilterNames.CARTOGRAPHY_ENTRY_TAGS)
        .elementIds,
  ],
  (
    entries,
    selectedNotExcluded,
    selectedSites,
    selectedProducts,
    selectedStatuses,
    selectedEmissionFactors,
    userId,
    selectedWriters,
    selectedOwners,
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

      const statusMatches = () =>
        isEmpty(selectedStatuses) || selectedStatuses[entry.status];

      const emissionFactorsMatches = () =>
        isEmpty(selectedEmissionFactors) ||
        selectedEmissionFactors[entry.emissionFactor?.id ?? -1];

      const userDataMatches = () =>
        userId === null ||
        entry.ownerId === userId ||
        entry.writerId === userId;

      const ownerMatches = () =>
        isEmpty(selectedOwners) || selectedOwners[entry.ownerId ?? -1];

      const writerMatches = () =>
        isEmpty(selectedWriters) || selectedWriters[entry.writerId ?? -1];

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
        statusMatches() &&
        emissionFactorsMatches() &&
        userDataMatches() &&
        ownerMatches() &&
        writerMatches() &&
        entryTagsMatches()
      );
    });
  }
);

export default selectFilteredActivityEntriesForCartography;
