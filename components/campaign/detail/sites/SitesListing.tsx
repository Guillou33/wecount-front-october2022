import React from "react";
import cx from "classnames";
import styles from "@styles/campaign/detail/sites/sites.module.scss";
import { SortFields, sortMethods } from "./helpers/sort";
import { useSort } from "@hooks/utils/useSort";
import { t } from "i18next";
import _, { upperFirst } from "lodash";
import SiteRow from "./SiteRow";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@reducers/index";
import { ShownSubSites } from "@reducers/core/siteReducer";
import { setShownSubSites } from "@actions/core/site/siteActions";
import SubSiteRow from "./SubSiteRow";
import { SiteEmission } from "@custom-types/core/Sites";

interface Props {
    campaignId: number;
    allSitesResults: SiteEmission[];
}

const SitesListing = ({campaignId, allSitesResults}: Props) => {
    const dispatch = useDispatch();

    const showSubSites = useSelector<RootState, ShownSubSites>(
        state => state.core.site.shownSubSites
    )

    const { sortField, sortDirAsc, updateSort, sortValues } = useSort<SortFields, SiteEmission>(SortFields.NAME, sortMethods);

    const renderSites = (allSitesResults: SiteEmission[]) => {
        const unallocatedSite = allSitesResults.filter(result => result.id === -1)[0];
        sortValues(allSitesResults);
        const allocatedSites = () => allSitesResults.map((site) => {
            const renderSubSites = () => site.subSites === undefined ? <></> : site.subSites.map(subSite => {
                return (
                    <SubSiteRow
                        key={subSite.id} 
                        site={subSite}
                        parentSite={site}
                    />
                )
            });
            return (
                <>
                    <SiteRow 
                        key={site.id} 
                        site={site}
                        areSubSitesShown={ 
                            showSubSites[site.id]
                        }
                        hasSubSites={
                            site.subSites !== undefined && 
                            site.subSites.length > 0
                        }
                        showSubSites={() => dispatch(setShownSubSites({siteId: site.id, show: !showSubSites[site.id]}))}
                    />
                    {showSubSites[site.id] && renderSubSites()}
                </>
            )
        });
        return (
            <tbody>
                {allocatedSites()}
                {/* {unallocatedSite !== undefined && <SiteRow site={unallocatedSite} areSubSitesShown={false} hasSubSites={false}/>} */}
            </tbody>
        )
    }

    const renderHeaderField = (
        name: string,
        sortFieldAssociated: SortFields,
        className?: string
    ) => {
        return (
            <th
                className={cx("header-clickable", className, {
                    ["active"]: sortField === sortFieldAssociated,
                })}
                onClick={() => updateSort(sortFieldAssociated)}
            >
                {name}
            </th>
        );
    };

    return (
        <>
            <table className={cx("wecount-table", styles.allSites)}>
                <thead>
                    {renderHeaderField(upperFirst(t("global.common.name")), SortFields.NAME)}
                    {renderHeaderField(t("footprint.emission.tco2.tco2e"), SortFields.RESULT_TCO2)}
                    {renderHeaderField(upperFirst(t("global.common.progression")), SortFields.STATUS)}
                    <th>{upperFirst(t("global.see"))}</th>
                </thead>
                {allSitesResults.length > 0 && renderSites(allSitesResults)}
            </table>
            {allSitesResults.length === 0 && (
                <div style={{textAlign:"center", fontStyle: "italic", width: "100%", marginTop: 20}}>
                    {upperFirst(t("site.noResultInSearch"))}
                </div>
            )}
        </>
    )
};

export default SitesListing;