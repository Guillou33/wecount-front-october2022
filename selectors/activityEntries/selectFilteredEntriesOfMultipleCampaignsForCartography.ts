import { isEmpty } from "lodash";
import { createSelector } from "reselect";

import mapObject from "@lib/utils/mapObject";

import { RootState } from "@reducers/index";
import { EntriesByCampaign } from "@lib/core/activityEntries/getCampaignsEntryInfoByActivityModel";

import selectNotExcludedFilter from "@selectors/filters/selectNotExcludedFilter";
import selectPresenceHashMapFilter from "@selectors/filters/selectPresenceMapFilter";
import selectStatusFilter from "@selectors/filters/selectStatusFilter";
import selectSearchableFilter from "@selectors/filters/selectSearchableFilter";
import selectUserDataFilter from "@selectors/filters/selectUserDataFilter";

import { FilterNames } from "@reducers/filters/filtersReducer";

const selectFilteredEntriesOfMultipleCampaignsForCartography = createSelector(
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
      selectStatusFilter(state, FilterNames.CARTOGRAPHY_STATUSES),
    (state: RootState) =>
      selectSearchableFilter(state, FilterNames.CARTOGRAPHY_EMISSION_FACTORS),
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
    entriesByCampaignId,
    selectedNotExcluded,
    selectedSites,
    selectedProducts,
    selectedStatuses,
    emissionFactors,
    userId,
    selectedWriters,
    selectedOwners,
    selectedEntryTags
  ): EntriesByCampaign => {
    return mapObject(entriesByCampaignId, entries =>
      entries.filter(entry => {
        const selectedEmissionFactors = emissionFactors.elementIds;

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
      })
    );
  }
);

export default selectFilteredEntriesOfMultipleCampaignsForCartography;
