import useLevelOneSiteEmission from "@hooks/core/useLevelOneSiteEmission";
import { SiteList } from "@reducers/core/siteReducer";

export const siteInfo = (
    siteId: number, 
    parentSiteId: number | null,
    campaignId: number,
    siteIdsInFilteredEntries: (number | null)[],
    siteList: SiteList
) => {
    if(parentSiteId){
        // if not allocated level 2 site
        const arrayIds = siteId === -1 ? [parentSiteId] : [siteId];

        const parentSiteEmission = useLevelOneSiteEmission({campaignId, levelOneSite: siteList[parentSiteId], siteIdsInFilteredEntries: arrayIds});
        return parentSiteEmission;
    }

    const siteEmission = useLevelOneSiteEmission({campaignId, levelOneSite: siteList[siteId], siteIdsInFilteredEntries});
    return siteEmission;
}