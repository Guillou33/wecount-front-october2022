import { emptySiteData, SiteEmission, SubSiteEmission } from "@custom-types/core/Sites";
import { Status } from "@custom-types/core/Status";
import { Site, SiteList, SubSite } from "@reducers/core/siteReducer";
import { t } from "i18next";
import _, { memoize, upperFirst } from "lodash";
import useSiteInfoFiltered from "./activityEntryInfo/useSiteInfoFiltered";
import useSiteInfoTotal from "./activityEntryInfo/useSiteInfoTotal";
import useSubSitesInSite from "./useSubSitesInSite";

const getParentSite = (sites: SiteList, subSiteId: number) => {
    const parentSite = _.pickBy(sites, (site, key) => {
        return site.subSites !== undefined && 
            Object.values(site.subSites).length > 0 && 
            Object.values(site.subSites).map(subSite => subSite.id).includes(subSiteId)
    });

    return Object.values(parentSite)[0];
}

const useSitesEmission = ({
    campaignId,
    sites,
}: {
    campaignId: number;
    sites: SiteList;
}) => {
    const sitesActivityInfo = useSiteInfoFiltered(campaignId);
    const allSitesActivityInfo = useSiteInfoTotal(campaignId);

    if(_.isEmpty(sitesActivityInfo) || _.isEmpty(allSitesActivityInfo)) return [];

    const sitesStats = _.map(sites, (site, siteKey) => {

        let totalSubSiteTco2 = 0;
        let totalSubSiteNb = 0;
        let totalSubSiteArchived = 0;
        let totalSubSiteInProgress = 0;
        let totalSubSiteToValidate = 0;
        let totalSubSiteTerminated = 0;

        const siteEmission: SiteEmission = sitesActivityInfo[parseInt(siteKey)] === undefined ? 
        {
            ...emptySiteData,
            id: site.id,
            name: site.name
        } : {
            id: parseInt(siteKey),
            name: parseInt(siteKey) < 0 || sites[parseInt(siteKey)] === undefined ? upperFirst(t("site.notAffectedSite.name")) : sites[parseInt(siteKey)].name,
            tCo2: sitesActivityInfo[parseInt(siteKey)].tCo2,
            nb: sitesActivityInfo[parseInt(siteKey)].nb,
            nbByStatus: {
                [Status.ARCHIVED]: sitesActivityInfo[parseInt(siteKey)].nbByStatus.ARCHIVED,
                [Status.IN_PROGRESS]: sitesActivityInfo[parseInt(siteKey)].nbByStatus.IN_PROGRESS,
                [Status.TO_VALIDATE]: sitesActivityInfo[parseInt(siteKey)].nbByStatus.TO_VALIDATE,
                [Status.TERMINATED]: sitesActivityInfo[parseInt(siteKey)].nbByStatus.TERMINATED,
            }
        }

        siteEmission.subSites = [];

        const subSitesInSite = useSubSitesInSite({}, site);

        if(site.subSites !== undefined && subSitesInSite.length > 0){
            
            const subSitesStats = subSitesInSite.filter(subSite => subSite.id !== -1).map(subSite => {

                totalSubSiteTco2 += sitesActivityInfo[subSite.id] === undefined ? 0 : sitesActivityInfo[subSite.id].tCo2;
                totalSubSiteNb += sitesActivityInfo[subSite.id] === undefined ? 0 : sitesActivityInfo[subSite.id].nb;
                totalSubSiteArchived += sitesActivityInfo[subSite.id] === undefined ? 0 : sitesActivityInfo[subSite.id].nbByStatus.ARCHIVED;
                totalSubSiteInProgress += sitesActivityInfo[subSite.id] === undefined ? 0 : sitesActivityInfo[subSite.id].nbByStatus.IN_PROGRESS;
                totalSubSiteToValidate += sitesActivityInfo[subSite.id] === undefined ? 0 : sitesActivityInfo[subSite.id].nbByStatus.TO_VALIDATE;
                totalSubSiteTerminated += sitesActivityInfo[subSite.id] === undefined ? 0 : sitesActivityInfo[subSite.id].nbByStatus.TERMINATED;

                const subSiteEmission: SubSiteEmission = sitesActivityInfo[subSite.id] === undefined ? 
                {
                    ...emptySiteData,
                    id: subSite.id,
                    name: subSite.name
                } : {
                    id: subSite.id,
                    name: subSite.name,
                    tCo2: sitesActivityInfo[subSite.id].tCo2,
                    nb: sitesActivityInfo[subSite.id].nb,
                    nbByStatus: sitesActivityInfo[subSite.id].nbByStatus
                }

                return subSiteEmission;
            });

            const subSitesEmissionsCleared = subSitesStats.filter(subSite => subSite.id !== -1);

            const unallocatedSubSiteStats = {
                id: -1,
                name: `${upperFirst(t("site.notAffectedSubSite.name"))}${site.name}`,
                tCo2: siteEmission.tCo2,
                nb: siteEmission.nb,
                nbByStatus: {
                    [Status.ARCHIVED]: siteEmission.nbByStatus.ARCHIVED,
                    [Status.IN_PROGRESS]: siteEmission.nbByStatus.IN_PROGRESS,
                    [Status.TO_VALIDATE]: siteEmission.nbByStatus.TO_VALIDATE,
                    [Status.TERMINATED]: siteEmission.nbByStatus.TERMINATED,
                }
            }

            if(subSitesEmissionsCleared.length > 0){

                siteEmission.tCo2 += totalSubSiteTco2;
                siteEmission.nb += totalSubSiteNb;
                siteEmission.nbByStatus.ARCHIVED += totalSubSiteArchived;
                siteEmission.nbByStatus.IN_PROGRESS += totalSubSiteInProgress;
                siteEmission.nbByStatus.TO_VALIDATE += totalSubSiteToValidate;
                siteEmission.nbByStatus.TERMINATED += totalSubSiteTerminated;

                siteEmission.subSites = [...subSitesEmissionsCleared, unallocatedSubSiteStats]

            }
        }

        return siteEmission;
    });

    const unallocatedSiteStats: SiteEmission = {
        id: -1,
        name: upperFirst(t("site.notAffectedSite.name")),
        tCo2: sitesActivityInfo[-1] === undefined ? 0 : sitesActivityInfo[-1].tCo2,
        nb: sitesActivityInfo[-1] === undefined ? 0 : sitesActivityInfo[-1].nb,
        nbByStatus: {
            [Status.ARCHIVED]: sitesActivityInfo[-1] === undefined ? 0 : sitesActivityInfo[-1].nbByStatus.ARCHIVED,
            [Status.IN_PROGRESS]: sitesActivityInfo[-1] === undefined ? 0 : sitesActivityInfo[-1].nbByStatus.IN_PROGRESS,
            [Status.TO_VALIDATE]: sitesActivityInfo[-1] === undefined ? 0 : sitesActivityInfo[-1].nbByStatus.TO_VALIDATE,
            [Status.TERMINATED]: sitesActivityInfo[-1] === undefined ? 0 : sitesActivityInfo[-1].nbByStatus.TERMINATED
        }
    }

    return [...sitesStats, unallocatedSiteStats];
}

export default useSitesEmission;

