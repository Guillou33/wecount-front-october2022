import React from 'react';
import cx from "classnames";
import SiteViewHeader, { View } from "./SiteViewHeader";
import SiteEntriesView from './SiteEntriesView';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@reducers/index';
import { SiteEditState } from '@reducers/core/siteReducer';
import useDisableBodyScroll from '@hooks/utils/useDisableBodyScroll';
import { useRouter } from 'next/router';
import { closeSiteModaleAndTimeoutEndEdit } from '@actions/core/site/siteActions';
import useSetOnceUsers from '@hooks/core/reduxSetOnce/useSetOnceUsers';
import RightModal from '@components/helpers/modal/RightModal';
import EntryTagFilter from '@components/filters/filterInputs/EntryTagFilter';
import FilterExcluded from '@components/filters/filterInputs/FilterExcluded';
import ProductFilter from '@components/filters/filterInputs/ProductFilter';
import EmissionFactorsFilter from "@components/filters/filterInputs/EmissionFactorsFilter";
import SiteFilter from '@components/filters/filterInputs/SiteFilter';
import UserFilter from '@components/filters/filterInputs/UserFilter';
import FilterModale from '@components/filters/FilterModale';
import { FilterNames } from '@reducers/filters/filtersReducer';
import ActivityModelFilter from '@components/filters/filterInputs/ActivityModelFilter';
import CategoryFilter from '@components/filters/filterInputs/CategoryFilter';
import StatusFilter from '@components/filters/filterInputs/StatusFilter';
import SiteHistory from './SiteHistory';
import SiteDoughnut from './SiteDoughnut';
import FilterBar from './FilterBar';

const SiteView = () => {
    useSetOnceUsers();
    const router = useRouter();
    const dispatch = useDispatch();
    const campaignId = useSelector<RootState, number>(
        // Set in getInitialProps
        state => state.campaign.currentCampaign!
    );
    const siteEdit = useSelector<RootState, SiteEditState>(
        state => state.core.site.siteEdit
    );
    const [currentView, setCurrentView] = React.useState<View>("LIST");
    const [filtersOpened, setFiltersOpened] = React.useState(false);
    
    useDisableBodyScroll();

    React.useEffect(() => {
        router.push(router.asPath + "#");
    }, []);

    React.useEffect(() => {
        const closeModale = () => {
            dispatch(closeSiteModaleAndTimeoutEndEdit());
        };

        window.addEventListener("popstate", closeModale);

        return () => window.removeEventListener("popstate", closeModale);
    }, []);

    return (
        <>
            {(siteEdit?.siteId !== undefined && siteEdit?.parentSiteId !== undefined) && (
                <SiteViewHeader
                    currentView={currentView}
                    setView={setCurrentView}
                    siteId={siteEdit?.siteId}
                    parentSiteId={siteEdit?.parentSiteId}
                />
            )}
            <FilterBar setOpen={setFiltersOpened} />
            <div className={cx("page-content-wrapper")}>
                {(siteEdit?.siteId !== undefined && siteEdit?.parentSiteId !== undefined) && 
                    <div className={cx("page-content")}>
                        {currentView === "LIST" && 
                            <SiteEntriesView
                                campaignId={campaignId}
                                siteId={siteEdit?.siteId}
                                parentSiteId={siteEdit?.parentSiteId}
                            />
                        }
                        {currentView === "HISTORY" && 
                            <SiteHistory
                                campaignId={campaignId}
                                siteId={siteEdit?.siteId}
                                parentSiteId={siteEdit?.parentSiteId}
                            />
                        }
                        {currentView === "DASHBOARD" && 
                            <SiteDoughnut 
                                campaignId={campaignId}
                                siteId={siteEdit?.siteId}
                                parentSiteId={siteEdit?.parentSiteId}
                            />
                        }
                    </div>
                }
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
                <ActivityModelFilter
                    filterName={FilterNames.LISTING_VIEW_ACTIVITY_MODELS}
                />
                <CategoryFilter filterName={FilterNames.LISTING_VIEW_CATEGORIES} />
                <EntryTagFilter filterName={FilterNames.CARTOGRAPHY_ENTRY_TAGS} />
                </FilterModale>
            </RightModal>
        </>
    )
}

export default SiteView;