import { createSelector } from "reselect";
import { isEmpty } from "lodash";

import { RootState } from "@reducers/index";

import selectActivityEntriesOfCampaign from "@selectors/activityEntries/selectActivityEntriesOfCampaign";
import selectNotExcludedFilter from "@selectors/filters/selectNotExcludedFilter";
import selectSearchableFilter from "@selectors/filters/selectSearchableFilter";
import selectPresenceHashMapFilter from "@selectors/filters/selectPresenceMapFilter";
import selectStatusFilter from "@selectors/filters/selectStatusFilter";
import selectAllActivityModelsRecord from "@selectors/activityModels/selectAllActivityModelsRecord";
import selectUserDataFilter from "@selectors/filters/selectUserDataFilter";
import { ActivityModelExtended } from "@selectors/activityModels/selectAllActivityModels";

import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";
import {
  PresenceHashMap,
  SearchableFilter,
} from "@reducers/filters/filtersReducer";
import { Status } from "@custom-types/core/Status";

import { FilterNames } from "@reducers/filters/filtersReducer";

const selectFilteredActivityEntriesForListingView: (
  state: RootState,
  campaignId: number
) => ActivityEntryExtended[] = createSelector<
  RootState,
  any,
  ActivityEntryExtended[]
>(
  [
    (state: RootState, campaignId: number) =>
      selectActivityEntriesOfCampaign(state, campaignId),
    (state: RootState) =>
      selectNotExcludedFilter(state, FilterNames.CARTOGRAPHY_EXCLUDED),
    selectAllActivityModelsRecord,
    (state: RootState) =>
      selectSearchableFilter(state, FilterNames.CARTOGRAPHY_SITES),
    (state: RootState) =>
      selectSearchableFilter(state, FilterNames.CARTOGRAPHY_PRODUCTS),
    (state: RootState) =>
      selectStatusFilter(state, FilterNames.CARTOGRAPHY_STATUSES),
    (state: RootState) =>
      selectSearchableFilter(state, FilterNames.CARTOGRAPHY_EMISSION_FACTORS),
    (state: RootState) =>
      selectSearchableFilter(state, FilterNames.LISTING_VIEW_ACTIVITY_MODELS),
    (state: RootState) =>
      selectSearchableFilter(state, FilterNames.LISTING_VIEW_CATEGORIES),
    (state: RootState) =>
      selectUserDataFilter(state, FilterNames.CARTOGRAPHY_USER_DATA),
    (state: RootState) =>
      selectPresenceHashMapFilter(state, FilterNames.CARTOGRAPHY_OWNER),
    (state: RootState) =>
      selectPresenceHashMapFilter(state, FilterNames.CARTOGRAPHY_WRITER),
    (state: RootState) =>
      selectSearchableFilter(state, FilterNames.CARTOGRAPHY_ENTRY_TAGS),
  ] as any, // any typing because of limitation of reselect typings
  (
    entries: ActivityEntryExtended[],
    selectedNotExcluded: number,
    allActivityModels: Record<number, ActivityModelExtended>,
    sitesFilter: SearchableFilter,
    productsFilter: SearchableFilter,
    selectedStatuses: PresenceHashMap<Status>,
    emissionFactorsFilter: SearchableFilter,
    activityModelsFilter: SearchableFilter,
    categoriesFilter: SearchableFilter,
    userId: number | null,
    selectedOwners: PresenceHashMap<number>,
    selectedWriters: PresenceHashMap<number>,
    entryTagsFilter: SearchableFilter
  ) =>
    entries.filter(entry => {
      const selectedSites = sitesFilter.elementIds;
      const selectedProducts = productsFilter.elementIds;
      const selectedEntryTags = entryTagsFilter.elementIds;
      const selectedEmissionFactors = emissionFactorsFilter.elementIds;
      const selectedActivityModels = activityModelsFilter.elementIds;
      const selectedCategories = categoriesFilter.elementIds;

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

      const activityModelsMatches = () =>
        isEmpty(selectedActivityModels) ||
        selectedActivityModels[entry.activityModelId];

      const categoryMatches = () =>
        isEmpty(selectedCategories) ||
        selectedCategories[allActivityModels[entry.activityModelId].categoryId];

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
        activityModelsMatches() &&
        categoryMatches() &&
        userDataMatches() &&
        ownerMatches() &&
        writerMatches() &&
        entryTagsMatches()
      );
    })
);

export default selectFilteredActivityEntriesForListingView;
