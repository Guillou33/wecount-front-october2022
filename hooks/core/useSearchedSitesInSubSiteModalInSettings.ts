
import { SiteList } from "@reducers/core/siteReducer";
import { RootState } from "@reducers/index";
import _ from "lodash";
import { useSelector } from "react-redux";
import useAllSiteList from "./useAllSiteList";

const useSearchedSitesInSubSiteModalInSettings = (active: boolean) => {
    const name = useSelector<RootState, string>(
        state => state.core.site.searchedTermsInSubSiteModalInSettings
    );

    const allSites = useAllSiteList({includeArchived: active});

    const resultsOfSearch = Object.values(allSites)
        .filter(site => 
            site.name.toLowerCase().includes(name.toLowerCase()) && (site.archivedDate !== null) === active
        );

    return name === "" || resultsOfSearch.length === 0 ? 
        Object.values(allSites).filter(site => (site.archivedDate !== null) === active) : 
        resultsOfSearch;
}

export default useSearchedSitesInSubSiteModalInSettings;