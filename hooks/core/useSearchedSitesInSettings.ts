
import { SiteList } from "@reducers/core/siteReducer";
import { RootState } from "@reducers/index";
import { useSelector } from "react-redux";

const useSearchedSitesInSettings = () => {
    const name = useSelector<RootState, string>(
        state => state.core.site.searchedTermsInSettings
    );

    const allSites = useSelector<RootState, SiteList>(
        state => state.core.site.siteList
    );

    const resultsOfSearch = Object.values(allSites)
        .filter(site => 
            site.name.toLowerCase().includes(name.toLowerCase()) || 
                (site.subSites !== undefined && Object.values(site.subSites).filter(subSite => subSite.name.toLowerCase().includes(name.toLowerCase())).length > 0)
        ).map(site => {
            if(site.subSites === undefined) return site;
            return {
                ...site,
                subSites: site.name.toLowerCase().includes(name.toLowerCase()) ? 
                    Object.values(site.subSites) : 
                    Object.values(site.subSites).filter(subSite => subSite && (subSite.name.toLowerCase().includes(name.toLowerCase())))
            }
        });
    return resultsOfSearch;
}

export default useSearchedSitesInSettings;