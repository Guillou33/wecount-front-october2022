import React, { useState } from 'react';

import { ExcludedFilter, FilterNames } from "@reducers/filters/filtersReducer";
import { CardExpansionNames } from "@reducers/cardExpansion/cardExpansionReducer";

import RightModal from "@components/helpers/modal/RightModal";
import FilterModale from "@components/filters/FilterModale";
import SiteFilter from "@components/filters/filterInputs/SiteFilter";
import ProductFilter from "@components/filters/filterInputs/ProductFilter";
import FilterTopBar from "@components/filters/FilterTopBar";
import ActiveSites from "@components/filters/activeBadges/ActiveSites";
import ActiveProducts from "@components/filters/activeBadges/ActiveProducts";
import SwitchUnitMode from "@components/campaign/detail/sub/SwitchUnitMode";
import ExpansionButtons from "@components/campaign/detail/sub/ExpansionButtons";
import CampaignDashboard from './CampaignDashboard';

import useCountSearchableFilter from "@hooks/core/filters/activeFiltersCount/useCountSearchableFilter";

import styles from "@styles/dashboard/dashboardHome.module.scss";
import cx from "classnames";
import FilterExcluded from '@components/filters/filterInputs/FilterExcluded';
import ActiveExcluded from '@components/filters/activeBadges/ActiveExcluded';
import EntryTagFilter from '@components/filters/filterInputs/EntryTagFilter';
import ActiveEntryTags from '@components/filters/activeBadges/ActiveEntryTags';
import { useSelector } from 'react-redux';
import { RootState } from '@reducers/index';

interface Props {
    campaignId: number;
};

const getActiveExcludedFilter = (active: number) => {
    return active === 0 ? 0 : active === 3 ? 2 : 1;
}

const ContentDashboardView = ({
    campaignId
}: Props) => {
    const [filtersOpened, setFiltersOpened] = useState(false);

    const viewIsTrajectory = useSelector<RootState, number>(
        state => state.dashboards.currentView
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
    const activeEntryTags = useCountSearchableFilter(
        FilterNames.CARTOGRAPHY_ENTRY_TAGS
    );
    const activeFilters =
        getActiveExcludedFilter(activeExcludedFilter) +
        activeSitesFilter +
        activeProductFilter +
        activeEntryTags;


    return (
        <>
            <FilterTopBar
                activeFilterNumber={activeFilters}
                onClickFilterButton={() => setFiltersOpened(true)}
                // rightControls={
                //     <>
                //         <ExpansionButtons cardExpansionName={CardExpansionNames.CARTOGRAPHY} />
                //         <SwitchUnitMode campaignId={campaignId} />
                //     </>
                // }
            >
                {activeExcludedFilter !== 0 ? (
                    <ActiveExcluded filterName={FilterNames.CARTOGRAPHY_EXCLUDED} />
                ) : (<></>)}
                <ActiveSites filterName={FilterNames.CARTOGRAPHY_SITES} />
                <ActiveProducts filterName={FilterNames.CARTOGRAPHY_PRODUCTS} />
                {/* <ActiveEmissionFactors
                filterName={FilterNames.CARTOGRAPHY_EMISSION_FACTORS}
                campaignId={campaignId}
            /> */}
            <ActiveEntryTags filterName={FilterNames.CARTOGRAPHY_ENTRY_TAGS} />
            </FilterTopBar>

            <div className={cx(styles.contentContainer, "page-content")}>
                <div className={cx(styles.dashboardContainer)}>
                    {campaignId && (
                        <CampaignDashboard campaignId={campaignId} />
                    )}
                </div>
            </div>
            <RightModal open={filtersOpened} onClose={() => setFiltersOpened(false)}>
                <FilterModale onClose={() => setFiltersOpened(false)}>
                    <FilterExcluded />
                    <SiteFilter filterName={FilterNames.CARTOGRAPHY_SITES} />
                    <ProductFilter filterName={FilterNames.CARTOGRAPHY_PRODUCTS} />
                    <EntryTagFilter filterName={FilterNames.CARTOGRAPHY_ENTRY_TAGS} />
                    {/* <EmissionFactorsFilter
                        filterName={FilterNames.CARTOGRAPHY_EMISSION_FACTORS}
                        campaignId={campaignId}
                    /> */}
                </FilterModale>
            </RightModal>
        </>
    );
};

export default ContentDashboardView;