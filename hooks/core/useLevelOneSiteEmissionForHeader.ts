import { emptySiteData, SiteEmission, SubSiteEmission } from "@custom-types/core/Sites";
import { Status } from "@custom-types/core/Status";
import { Site, SubSite } from "@reducers/core/siteReducer";
import { t } from "i18next";
import _, { upperFirst } from "lodash";
import useSiteInfoFiltered from "./activityEntryInfo/useSiteInfoFiltered";
import useSiteInfoTotal from "./activityEntryInfo/useSiteInfoTotal";
import useSubSitesInSite from "./useSubSitesInSite";

const useLevelOneSiteEmissionForHeader = ({
    campaignId,
    levelOneSite,
    siteIdsInFilteredEntries,
    activeExcludedFilter
}: {
    campaignId: number,
    levelOneSite: Site,
    siteIdsInFilteredEntries: (number | null)[],
    activeExcludedFilter: number
}) => {
    const filteredSitesActivityInfo = useSiteInfoFiltered(campaignId);
    
    const allSitesActivityInfo = useSiteInfoTotal(campaignId);

    if(_.isEmpty(allSitesActivityInfo) || _.isEmpty(filteredSitesActivityInfo)) 
        return emptySiteData;

    if(levelOneSite === undefined){

        return filteredSitesActivityInfo[-1] !== undefined ? filteredSitesActivityInfo[-1] : emptySiteData;
    }
    
    const subSitesInSite = useSubSitesInSite({}, levelOneSite);

    const siteEmission: SiteEmission = {
        id: levelOneSite.id,
        name: levelOneSite.name,
        tCo2: allSitesActivityInfo[levelOneSite.id].tCo2,
        nb: allSitesActivityInfo[levelOneSite.id].nb,
        nbByStatus: {
            [Status.ARCHIVED]: allSitesActivityInfo[levelOneSite.id].nbByStatus.ARCHIVED,
            [Status.IN_PROGRESS]: allSitesActivityInfo[levelOneSite.id].nbByStatus.IN_PROGRESS,
            [Status.TO_VALIDATE]: allSitesActivityInfo[levelOneSite.id].nbByStatus.TO_VALIDATE,
            [Status.TERMINATED]: allSitesActivityInfo[levelOneSite.id].nbByStatus.TERMINATED,
        }
    }

    if(levelOneSite.subSites !== undefined){

        let siteIdsToDisplay = subSitesInSite.map(subSite => subSite.id).filter(id => siteIdsInFilteredEntries.includes(id));

        if(siteIdsInFilteredEntries.includes(levelOneSite.id)){
            siteIdsToDisplay = [levelOneSite.id, ...siteIdsToDisplay];
        }
        
        let infoToDisplay = {
            nb: 0,
            tCo2: 0,
            nbByStatus: {
                [Status.ARCHIVED]: 0,
                [Status.IN_PROGRESS]: 0,
                [Status.TO_VALIDATE]: 0,
                [Status.TERMINATED]: 0,
            }
        }

        siteIdsToDisplay.map(id => {
            return filteredSitesActivityInfo[id];
        }).forEach(info => {
            infoToDisplay.nb += info.nb;
            infoToDisplay.tCo2 += info.tCo2;
            infoToDisplay.nbByStatus[Status.ARCHIVED] += info.nbByStatus.ARCHIVED;
            infoToDisplay.nbByStatus[Status.IN_PROGRESS] += info.nbByStatus.IN_PROGRESS;
            infoToDisplay.nbByStatus[Status.TO_VALIDATE] += info.nbByStatus.TO_VALIDATE;
            infoToDisplay.nbByStatus[Status.TERMINATED] += info.nbByStatus.TERMINATED;
        });
        
        return infoToDisplay;
    }

    return siteEmission;
};

export default useLevelOneSiteEmissionForHeader;