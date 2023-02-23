import { Site, SubSite } from "@reducers/core/siteReducer";
import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";
import { t } from "i18next";
import { upperFirst } from "lodash";

export const siteTitleForHeader = (site: Site | SubSite | undefined, parentSite: Site | undefined) => {
    // allocated to a site and a level 2 site
    if(site !== undefined && parentSite !== undefined) 
        return `${parentSite.name} - ${site.name}`;

    // unallocated to any site
    if(site === undefined && parentSite === undefined) return upperFirst(t("site.notAffectedSite.name"));

    // allocated to a site but not to a level 2 site
    if(site === undefined && parentSite !== undefined) return `${parentSite.name} - ${upperFirst(t("site.notAffectedSubSite.name"))}`;

    // allocated to a level 1 site
    if(site !== undefined && parentSite === undefined) return site.name;
            
    return upperFirst(t("site.site"));
}
