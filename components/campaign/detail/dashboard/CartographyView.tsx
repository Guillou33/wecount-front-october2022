import { useState } from "react";

import { ExcludedFilter, FilterNames } from "@reducers/filters/filtersReducer";
import { CardExpansionNames } from "@reducers/cardExpansion/cardExpansionReducer";

import Scopes from "@components/campaign/detail/dashboard/Scopes";
import RightModal from "@components/helpers/modal/RightModal";
import FilterModale from "@components/filters/FilterModale";
import SiteFilter from "@components/filters/filterInputs/SiteFilter";
import ProductFilter from "@components/filters/filterInputs/ProductFilter";
import StatusFilter from "@components/filters/filterInputs/StatusFilter";
import EmissionFactorsFilter from "@components/filters/filterInputs/EmissionFactorsFilter";
import FilterTopBar from "@components/filters/FilterTopBar";
import ActiveSites from "@components/filters/activeBadges/ActiveSites";
import ActiveProducts from "@components/filters/activeBadges/ActiveProducts";
import ActiveStatuses from "@components/filters/activeBadges/ActiveStatuses";
import ActiveEmissionFactors from "@components/filters/activeBadges/ActiveEmissionFactors";
import SwitchUnitMode from "@components/campaign/detail/sub/SwitchUnitMode";
import ExpansionButtons from "@components/campaign/detail/sub/ExpansionButtons";
import UserFilter from "@components/filters/filterInputs/UserFilter";
import ActiveUsers from "@components/filters/activeBadges/ActiveUsers";
import EntryTagFilter from "@components/filters/filterInputs/EntryTagFilter";
import ActiveEntryTags from "@components/filters/activeBadges/ActiveEntryTags";

import useCountHashMapFilter from "@hooks/core/filters/activeFiltersCount/useCountHashMapFilter";
import useCountSearchableFilter from "@hooks/core/filters/activeFiltersCount/useCountSearchableFilter";
import ActiveExcluded from "@components/filters/activeBadges/ActiveExcluded";
import FilterExcluded from "@components/filters/filterInputs/FilterExcluded";
import { RootState } from "@reducers/index";
import { useSelector } from "react-redux";

interface Props {
  campaignId: number;
}

const getActiveExcludedFilter = (active: number) => {
  return active === 0 ? 0 : active === 3 ? 2 : 1;
};

const CartographyView = ({ campaignId }: Props) => {
  const [filtersOpened, setFiltersOpened] = useState(false);

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
  const activeEntryTagFilter = useCountSearchableFilter(
    FilterNames.CARTOGRAPHY_ENTRY_TAGS
  )

  const activeFilters =
    getActiveExcludedFilter(activeExcludedFilter) +
    activeSitesFilter +
    activeProductFilter +
    activeStatusFilter +
    activeEmissionFactorsFilter +
    activeOwnerFilter +
    activeWriterFilter +
    activeEntryTagFilter;

  return (
    <>
      <FilterTopBar
        activeFilterNumber={activeFilters}
        onClickFilterButton={() => setFiltersOpened(true)}
        rightControls={
          <>
            <ExpansionButtons
              cardExpansionName={CardExpansionNames.CARTOGRAPHY}
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
        <ActiveUsers
          filterName={FilterNames.CARTOGRAPHY_WRITER}
          kind="writer"
        />
        <ActiveStatuses filterName={FilterNames.CARTOGRAPHY_STATUSES} />
        <ActiveEmissionFactors
          filterName={FilterNames.CARTOGRAPHY_EMISSION_FACTORS}
          campaignId={campaignId}
        />
        <ActiveEntryTags filterName={FilterNames.CARTOGRAPHY_ENTRY_TAGS} />
      </FilterTopBar>
      <div className="page-content">
        <Scopes />
      </div>
      <RightModal open={filtersOpened} onClose={() => setFiltersOpened(false)}>
        <FilterModale onClose={() => setFiltersOpened(false)}>
          <FilterExcluded />
          <SiteFilter filterName={FilterNames.CARTOGRAPHY_SITES} />
          <ProductFilter filterName={FilterNames.CARTOGRAPHY_PRODUCTS} />
          <UserFilter filterName={FilterNames.CARTOGRAPHY_OWNER} kind="owner" />
          <UserFilter
            filterName={FilterNames.CARTOGRAPHY_WRITER}
            kind="writer"
          />
          <StatusFilter filterName={FilterNames.CARTOGRAPHY_STATUSES} />
          <EmissionFactorsFilter
            filterName={FilterNames.CARTOGRAPHY_EMISSION_FACTORS}
            campaignId={campaignId}
          />
          <EntryTagFilter filterName={FilterNames.CARTOGRAPHY_ENTRY_TAGS} />
        </FilterModale>
      </RightModal>
    </>
  );
};

export default CartographyView;
