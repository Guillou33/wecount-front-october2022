
import { SiteList } from "@reducers/core/siteReducer";
import { RootState } from "@reducers/index";
import _ from "lodash";
import { useSelector } from "react-redux";
import useAllSiteList from "./useAllSiteList";

const useSearchedSitesInSiteCreationModalInSettings = () => {
    const name = useSelector<RootState, string>(
        state => state.core.site.searchedTermsInSiteCreationModalInSettings
    );

    const allSites = useAllSiteList();

    const resultsOfSearch = Object.values(allSites)
        .filter(site => 
            site.name.toLowerCase().includes(name.toLowerCase())
        );

    return name === "" || resultsOfSearch.length === 0 ? 
        Object.values(allSites) : 
        resultsOfSearch;
}

export default useSearchedSitesInSiteCreationModalInSettings;