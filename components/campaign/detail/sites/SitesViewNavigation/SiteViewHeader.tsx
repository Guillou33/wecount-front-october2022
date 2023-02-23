import cx from "classnames";
import { t } from "i18next";
import { upperFirst } from "lodash";
import { FiCalendar } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import styles from "@styles/campaign/detail/activity/sub/editActivityHeaderNew.module.scss";
import useAllSiteList from "@hooks/core/useAllSiteList";
import { RootState } from "@reducers/index";
import { Campaign as CampaignType } from "@reducers/campaignReducer";
import { getStatusesPercentageFromStatusesCount } from "@hooks/core/helpers/statusesCount";
import moment from "moment";
import selectFilteredActivityEntriesForSites from "@selectors/activityEntries/selectFilteredActivityEntriesForSites";

import StatusProgress from "@components/core/StatusProgress";
import Tabs from "@components/helpers/ui/Tabs";
import { ExcludedFilter } from "@reducers/filters/filtersReducer";
import useUserHasPerimeterRole from "@hooks/core/perimeterAccessControl/useUserHasPerimeterRole";
import { PerimeterRole } from "@custom-types/wecount-api/auth";
import { closeSiteModaleAndTimeoutEndEdit } from "@actions/core/site/siteActions";
import { siteTitleForHeader } from "../utils/siteTitleForHeader";
import useAllSubSiteList from "@hooks/core/useAllSubSiteList";
import { siteInfo } from "../helpers/infos";
import { siteInfoForNotExcludedTco2Header, siteInfoForTco2Header } from "../utils/siteInfosForHeader";
import Tco2ResultBadge from "@components/core/Tco2ResultBadge";

export type View = "LIST" | "HISTORY" | "DASHBOARD";

interface Props {
    currentView: View;
    setView: (view: View) => void;
    siteId: number;
    parentSiteId: number | null;
}

const SiteViewHeader = ({
    currentView,
    setView,
    siteId,
    parentSiteId
}: Props) => {
    const dispatch = useDispatch();

    const campaignId = useSelector<RootState, number>(
        // Set in getInitialProps
        state => state.campaign.currentCampaign!
    );
    const campaign = useSelector<RootState, CampaignType | undefined>(
        state => state.campaign.campaigns[campaignId]
    );
    
    const isExcludedChecked = useSelector<RootState, ExcludedFilter>(
        state => state.filters.cartographyExcluded
    );
    const activeExcludedFilter = isExcludedChecked.excludedEntries;

    const siteList = useAllSiteList();
    const subSiteList = useAllSubSiteList();

    const filteredEntries = useSelector((state: RootState) =>
        selectFilteredActivityEntriesForSites(state, campaignId)
    );

    const siteIdsInFilteredEntries = [...new Set(filteredEntries.map(entry => entry.siteId))].filter(siteId => siteId !== null);

    const siteInfoTotal = siteInfo(siteId, parentSiteId, campaignId, siteIdsInFilteredEntries, siteList);

    const entryInfoForHeaderTotal =
        siteInfoForTco2Header(campaignId, siteList[siteId] === undefined ? subSiteList[siteId] : siteList[siteId], siteList[parentSiteId ?? -1])
    const notExcludedEntriesInfoTotal =
        siteInfoForNotExcludedTco2Header(campaignId, siteList[siteId] === undefined ? subSiteList[siteId] : siteList[siteId], siteList[parentSiteId ?? -1])

    const activitiesProgression = getStatusesPercentageFromStatusesCount({
        ...siteInfoTotal.nbByStatus,
        total: siteInfoTotal.nb,
    });
  
    const isCollaborator = useUserHasPerimeterRole(
      PerimeterRole.PERIMETER_COLLABORATOR
    );

    return (   
        <div className={cx(styles.header, "page-header")}>
            <div className={cx(styles.campaignInfoWrapper)}>
                <div className={cx(styles.campaignInfo)}>
                    <div className={cx(styles.campaignInfoInnerLeft)}>
                        <div className={styles.pageStatusBar}>
                            <button
                                onClick={() => {
                                    dispatch(closeSiteModaleAndTimeoutEndEdit());
                                }}
                                className={styles.button}
                            >
                                <span className={cx(styles.spanStatusBar)}>{"<"}</span>{" "}
                                <span className={styles.linkStatusBar}>
                                    {upperFirst(t("cartography.backToCartography"))}
                                </span>
                            </button>
                        </div>
                        <div className={cx(styles.campaignTitleInnerLeft)}>
                            <h1
                                className={styles.campaignTitle}
                            >{`${siteTitleForHeader(parentSiteId ? subSiteList[siteId ?? -1] : siteList[siteId ?? -1], siteList[parentSiteId ?? -1])}`}</h1>
                        </div>
                        <div className={styles.yearSelectorsContainer}>
                            <div className={styles.campaignNameHeader}>
                                <p>{campaign?.information?.name ?? ""}</p>
                            </div>
                            <div
                                className={styles.selectedYearField}
                                style={{ color: "#c5cae7" }}
                            >
                                <FiCalendar color="#c5cae7" size="12" />
                                <p style={{ marginLeft: 5 }}>
                                    {upperFirst(t("global.time.year"))} : 
                                </p>
                                <span className={cx(styles.selectedYear)}>
                                    {campaign?.information?.year || moment().format("YYYY")}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className={cx(styles.campaignInfoInnerRight)}>
                    <StatusProgress
                        className={cx(styles.activitiesProgression, {
                            ["mr-0"]: !isCollaborator,
                        })}
                        total={activitiesProgression.total}
                        toValidate={activitiesProgression.TO_VALIDATE}
                        validated={activitiesProgression.TERMINATED}
                        inProgress={activitiesProgression.IN_PROGRESS}
                        label={t("entry.entry")}
                    />
                    {isCollaborator && (
                        <div className={cx(styles.campaignInfoResultBadge)}>
                            <Tco2ResultBadge
                                className={styles.campaignResults}
                                resultTco2={siteInfoTotal.tCo2}
                                totalResultTco2={entryInfoForHeaderTotal.tCo2}
                                notExcludedResultTco2={notExcludedEntriesInfoTotal.tCo2}
                                active={activeExcludedFilter}
                            />
                        </div>
                    )}
                </div>
            </div>
            {/* {campaignHasHiddenEmissions && (
                <Tooltip content={upperFirst(t("entry.emission.hiddenEmission"))}>
                    <div className={cx(styles.hasHiddenEmissionsBadge)}>
                        <i className="fa fa-exclamation-triangle"></i>
                    </div>
                </Tooltip>
            )} */}
            </div>
            <div className={styles.tabsContainer}>
                <Tabs
                    className={styles.tabs}
                    value={currentView}
                    onChange={setView}
                    tabItems={[
                        {
                          value: "LIST" as const,
                          label: t("cartography.list").toUpperCase(),
                        },
                        {
                          value: "HISTORY" as const,
                          label: t("entry.history.history").toUpperCase(),
                        },
                        {
                          value: "DASHBOARD" as const,
                          label: t("global.common.synthesis").toUpperCase(),
                        },
                      ]}
                />
            </div>
        </div>
    );
}

export default SiteViewHeader;