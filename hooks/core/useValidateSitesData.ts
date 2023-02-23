import { DataSitesImportError, SitesDataError } from "@custom-types/core/Sites";
import useAllSiteList from "@hooks/core/useAllSiteList";
import { SiteData, SitesDataList } from "@reducers/dataImport/sitesDataReducer";
import _ from "lodash";

interface ValidateSiteData extends SiteData {
    error: DataSitesImportError;
}


const useValidateSitesData = (
    sitesDataList: SiteData[],
    allSitesName: string[],
    mainSitesName: string[]
) => {
    const allSitesDataName = _.map(sitesDataList, siteData => siteData.name);
    const allParentSitesDataName = _.filter(sitesDataList, siteData => siteData.level === 1).map(siteData => siteData.name);

    const validatedSitesDataList: ValidateSiteData[] = sitesDataList.map(siteData => {
        let error = {
            [SitesDataError.UNEXISTING_PARENT]: false,
            [SitesDataError.DUPLICATED_SITE]: false,
            [SitesDataError.EMPTY_NAME]: false,
        }
        
        if(!siteData.name || siteData.name === "")
            error[SitesDataError.EMPTY_NAME] = true;

        if (siteData.parent && siteData.parent !== "" && ![...allParentSitesDataName, ...mainSitesName].includes(siteData.parent))
            error[SitesDataError.UNEXISTING_PARENT] = true;
        
        if(
            allSitesName.filter(siteName => siteName === siteData.name).length > 0 || 
            allSitesDataName.filter(siteName => siteName === siteData.name).length > 1
        )
            error[SitesDataError.DUPLICATED_SITE] = true;
        
        return { ...siteData, error };
    });

    return validatedSitesDataList;
};

export default useValidateSitesData;
