import { useSelector } from "react-redux";

import { RootState } from "@reducers/index";
import { FilterNames } from "@reducers/filters/filtersReducer";
import { DEFAULT_STATUS, Status } from "@custom-types/core/Status";

import selectSearchableFilter from "@selectors/filters/selectSearchableFilter";
import selectStatusFilter from "@selectors/filters/selectStatusFilter";

function useFirstDataFromFilters() {
  const siteIdsToShow = useSelector((state: RootState) =>
    selectSearchableFilter(state, FilterNames.CARTOGRAPHY_SITES)
  ).elementIds;

  const productIdsToShow = useSelector((state: RootState) =>
    selectSearchableFilter(state, FilterNames.CARTOGRAPHY_PRODUCTS)
  ).elementIds;

  const statusesToShow = useSelector((state: RootState) =>
    selectStatusFilter(state, FilterNames.CARTOGRAPHY_STATUSES)
  );

  const emissionFactorsToShow = useSelector((state: RootState) =>
    selectSearchableFilter(state, FilterNames.CARTOGRAPHY_EMISSION_FACTORS)
  );

  const selectedTagIds = useSelector((state: RootState) =>
    selectSearchableFilter(state, FilterNames.CARTOGRAPHY_ENTRY_TAGS)
  ).elementIds;

  const firstSiteId = Object.keys(siteIdsToShow)[0];
  const firstProductId = Object.keys(productIdsToShow)[0];
  const firstStatus = Object.keys(statusesToShow)[0];
  const firstEmissionFactorId = Object.keys(emissionFactorsToShow)[0];

  return {
    firstSiteId: firstSiteId ? Number(firstSiteId) : null,
    firstProductId: firstProductId ? Number(firstProductId) : null,
    firstStatus: (firstStatus ?? DEFAULT_STATUS) as Status,
    firstEmissionFactorId: firstEmissionFactorId
      ? Number(firstEmissionFactorId)
      : null,
    entryTagIds: Object.keys(selectedTagIds).map(tagId => Number(tagId)),
  };
}

export default useFirstDataFromFilters;
