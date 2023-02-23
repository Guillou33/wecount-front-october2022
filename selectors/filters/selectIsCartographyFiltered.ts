import { createSelector } from "reselect";
import { isEmpty } from "lodash";

import { RootState } from "@reducers/index";

import selectPresenceHashMapFilter from "./selectPresenceMapFilter";
import selectSearchableFilter from "./selectSearchableFilter";
import selectStatusFilter from "./selectStatusFilter";
import selectUserDataFilter from "@selectors/filters/selectUserDataFilter";

import { FilterNames } from "@reducers/filters/filtersReducer";

const selectIsCartographyFiltered = createSelector(
  (state: RootState) =>
    selectSearchableFilter(state, FilterNames.CARTOGRAPHY_SITES),
  (state: RootState) =>
    selectSearchableFilter(state, FilterNames.CARTOGRAPHY_PRODUCTS),
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
    selectSearchableFilter(state, FilterNames.CARTOGRAPHY_ENTRY_TAGS),
  (
    selectedSites,
    selectedProducts,
    selectedStatuses,
    emissionFactors,
    userId,
    selectedWriters,
    selectedOwners,
    selectedEntryTags
  ) =>
    !(
      isEmpty(selectedSites.elementIds) &&
      isEmpty(selectedProducts.elementIds) &&
      isEmpty(selectedStatuses) &&
      isEmpty(emissionFactors.elementIds) &&
      isEmpty(selectedWriters) &&
      isEmpty(selectedOwners) &&
      userId === null &&
      isEmpty(selectedEntryTags.elementIds)
    )
);

export default selectIsCartographyFiltered;
