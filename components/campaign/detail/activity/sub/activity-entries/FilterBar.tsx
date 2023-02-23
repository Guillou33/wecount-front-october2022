import { useSelector } from "react-redux";

import { RootState } from "@reducers/index";
import { ExcludedFilter, FilterNames } from "@reducers/filters/filtersReducer";
import { CardExpansionNames } from "@reducers/cardExpansion/cardExpansionReducer";

import FilterTopBar from "@components/filters/FilterTopBar";
import ActiveSites from "@components/filters/activeBadges/ActiveSites";
import ActiveProducts from "@components/filters/activeBadges/ActiveProducts";
import ActiveStatuses from "@components/filters/activeBadges/ActiveStatuses";
import ActiveEmissionFactors from "@components/filters/activeBadges/ActiveEmissionFactors";
import ActiveUsers from "@components/filters/activeBadges/ActiveUsers";
import ActiveEntryTags from "@components/filters/activeBadges/ActiveEntryTags";

import SwitchUnitMode from "@components/campaign/detail/sub/SwitchUnitMode";
import ExpansionButtons from "@components/campaign/detail/sub/ExpansionButtons";

import useCountHashMapFilter from "@hooks/core/filters/activeFiltersCount/useCountHashMapFilter";
import useCountSearchableFilter from "@hooks/core/filters/activeFiltersCount/useCountSearchableFilter";
import ActiveExcluded from "@components/filters/activeBadges/ActiveExcluded";

interface Props {
  setOpen: (opened: boolean) => void;
}

const getActiveExcludedFilter = (active: number) => {
  return active === 0 || active === 3 ? 0 : 1;
};

const FilterBar = ({ setOpen }: Props) => {
  const campaignId = useSelector<RootState, number>(
    state => state.campaign.currentCampaign!
  );

  const isExcludedChecked = useSelector<RootState, ExcludedFilter>(
    state => state.filters.cartographyExcluded
  );
  const activeExcludedFilter = isExcludedChecked.excludedEntries;

  const activeSitesFilter = useCountSearchableFilter(
    FilterNames.CARTOGRAPHY_SITES
  );
  const activeProductFilter = useCountSearchableFilter(
    FilterNames.CARTOGRAPHY_PRODUCTS
  );
  const activeStatusFilter = useCountHashMapFilter(
    FilterNames.CARTOGRAPHY_STATUSES
  );
  const activeEmissionFactorsFilter = useCountSearchableFilter(
    FilterNames.CARTOGRAPHY_EMISSION_FACTORS
  );
  const activeOwnerFilter = useCountHashMapFilter(
    FilterNames.CARTOGRAPHY_OWNER
  );
  const activeWriterFilter = useCountHashMapFilter(
    FilterNames.CARTOGRAPHY_WRITER
  );
  const activeEntryTags = useCountSearchableFilter(
    FilterNames.CARTOGRAPHY_ENTRY_TAGS
  );
  const activeFilters =
    getActiveExcludedFilter(activeExcludedFilter) +
    activeSitesFilter +
    activeProductFilter +
    activeStatusFilter +
    activeEmissionFactorsFilter +
    activeOwnerFilter +
    activeWriterFilter +
    activeEntryTags;
  return (
    <FilterTopBar
      activeFilterNumber={activeFilters}
      onClickFilterButton={() => setOpen(true)}
      rightControls={
        <>
          <ExpansionButtons
            cardExpansionName={CardExpansionNames.EDIT_ENTRIES}
          />
          <SwitchUnitMode campaignId={campaignId} />
        </>
      }
      myDataFilterName={FilterNames.CARTOGRAPHY_USER_DATA}
    >
      {activeExcludedFilter !== 0 ? (
        <ActiveExcluded filterName={FilterNames.CARTOGRAPHY_EXCLUDED} />
      ) : (
        <></>
      )}
      <ActiveSites filterName={FilterNames.CARTOGRAPHY_SITES} />
      <ActiveProducts filterName={FilterNames.CARTOGRAPHY_PRODUCTS} />
      <ActiveUsers filterName={FilterNames.CARTOGRAPHY_OWNER} kind="owner" />
      <ActiveUsers filterName={FilterNames.CARTOGRAPHY_WRITER} kind="writer" />
      <ActiveStatuses filterName={FilterNames.CARTOGRAPHY_STATUSES} />
      <ActiveEmissionFactors
        filterName={FilterNames.CARTOGRAPHY_EMISSION_FACTORS}
        campaignId={campaignId}
      />
      <ActiveEntryTags filterName={FilterNames.CARTOGRAPHY_ENTRY_TAGS} />
    </FilterTopBar>
  );
};

export default FilterBar;
