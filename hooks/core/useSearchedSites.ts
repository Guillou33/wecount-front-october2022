import { SiteEmission } from "@custom-types/core/Sites";
import { RootState } from "@reducers/index";
import { useSelector } from "react-redux";

const useSearchedSites = (allSitesEmissions: SiteEmission[]) => {
    const name = useSelector<RootState, string>(
        state => state.core.site.searchedTerms
    );

    const resultsOfSearch = allSitesEmissions
        .filter(site => 
            site.name.toLowerCase().includes(name.toLowerCase()) || 
            (site.subSites !== undefined && Object.values(site.subSites).filter(subSite => subSite.name.toLowerCase().includes(name.toLowerCase())).length > 0)
        ).map(site => {
            if(site.subSites === undefined) return site;
            return {
                ...site,
                subSites: Object.values(site.subSites).filter(subSite => subSite.name.toLowerCase().includes(name.toLowerCase()))
            }
        });
    return resultsOfSearch;
}

export default useSearchedSites;