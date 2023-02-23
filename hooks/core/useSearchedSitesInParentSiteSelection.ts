import { RootState } from "@reducers/index";
import { useSelector } from "react-redux";

const useSearchedSitesInParentSiteSelection = (allParentSitesList: { id: string; value: string; }[], siteDataId: string) => {
    const name = useSelector<RootState, string>(
        state => state.dataImport.sitesData.searchedTermsInParentSiteSelection[siteDataId]
    );

    if(name === undefined){
        return allParentSitesList;
    }

    const parentSite = useSelector<RootState, string>(
        state => state.dataImport.sitesData.sitesDataList[siteDataId].parent ?? ""
    );

    const resultsOfSearch = allParentSitesList
        .filter(parent => 
            parent.value.toLowerCase().includes(name.toLowerCase())
        );
        
    return [
        ...allParentSitesList.filter(parentItem => parentItem.value === parentSite), 
        ...resultsOfSearch.filter(result => result.value !== parentSite)
    ];

}

export default useSearchedSitesInParentSiteSelection;