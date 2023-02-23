import Link from "next/link";
import cx from "classnames";
import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import moment from 'moment';
import styles from "@styles/core/header.module.scss";

import CampaignsDropdown from '@components/campaign/detail/CampaignsDropdown';
import CampaignBradcrums from '@components/campaign/detail/sub/CampaignBradcrums';
import StatusProgress from './StatusProgress';
import Tco2ResultBadge from './Tco2ResultBadge';
import DownloadCampaign from "@components/campaign/detail/sub/DownloadCampaign";
import Tabs from "@components/helpers/ui/Tabs";
import Tooltip from "@components/helpers/bootstrap/Tooltip";


import { getStatusesPercentageFromStatusesCount, StatusesCountWithTotal } from "@hooks/core/helpers/statusesCount";
import useCampaignHasHiddenEmissions from "@hooks/core/useCampaignHasHiddenEmissions";
import { PerimeterRole } from "@custom-types/wecount-api/auth";
import useUserHasPerimeterRole from "@hooks/core/perimeterAccessControl/useUserHasPerimeterRole";
import IfHasPerimeterRole from "@components/auth/access-control/IfHasPerimeterRole";

import { Campaign as CampaignType } from "@reducers/campaignReducer";
import { RootState } from "@reducers/index";
import { CampaignTrajectory } from "@reducers/trajectory/campaignTrajectories/campaignTrajectoriesReducer";
import useAllEntriesInfoTotal from "@hooks/core/activityEntryInfo/useAllEntriesInfoTotal";
import { TrajectoryViewItem } from "@components/campaign/detail/trajectory/helpers/TrajectoryTabItems";
import TrajectoryHeader from "@components/campaign/detail/trajectory/TrajectoryHeader";
import useHeaderEntriesInfoTotal from "@hooks/core/activityEntryInfo/useHeaderEntriesInfoTotal";
import { CampaignType as CampaignTypeEnum } from "@custom-types/core/CampaignType";
import { getCampaignTypeShortName } from "@lib/core/campaign/getCampaignTypeName";
import { statusReadable } from "@lib/core/campaign/statusReadable";
import { upperFirst } from "lodash";
import { ExcludedFilter } from "@reducers/filters/filtersReducer";
import useNotExcludedEntriesInfoTotal from "@hooks/core/notExcludedActivityEntryInfo/useNotExcludedInfoTotal";
import { t } from "i18next";
import CampaignStatusBadge from "./CampaignStatusBadge";

type Tab = {
    value: any;
    label: string;
    badge?: string;
}

type Props = {
    title: string;
    menu: string;
    campaign: CampaignType | undefined;
    availableTabs: Tab[];
    currentView: any;
    onChange: (Tab: any) => void;
    currentTrajectory: CampaignTrajectory | null | undefined;
};


const MainHeader = ({
    title,
    menu,
    campaign,
    availableTabs,
    currentView,
    onChange,
}: Props) => {
    const dispatch = useDispatch();

    const campaignId = useSelector<RootState, number>(
        // Set in getInitialProps
        state => state.campaign.currentCampaign!
    );

    const isExcludedChecked = useSelector<RootState, ExcludedFilter>(
      state => state.filters.cartographyExcluded
    );
    const activeExcludedFilter = isExcludedChecked.excludedEntries;

    const entryInfoTotal = useAllEntriesInfoTotal(campaignId);
    const entryInfoForHeaderTotal = useHeaderEntriesInfoTotal(campaignId);
    const notExcludedEntriesInfoTotal = useNotExcludedEntriesInfoTotal(campaignId);

    const activitiesProgression = getStatusesPercentageFromStatusesCount({
        ...entryInfoForHeaderTotal.nbByStatus,
        total: entryInfoForHeaderTotal.nb,
    });

    const campaignHasHiddenEmissions = useCampaignHasHiddenEmissions(campaignId);

    const isCollaborator = useUserHasPerimeterRole(PerimeterRole.PERIMETER_COLLABORATOR);

    const renderHeaderTrajectory = () => {

        const selectedTrajectoryView = useSelector<RootState, TrajectoryViewItem>(
            state => state.trajectory.currentTrajectory.currentTrajectoryView
        );

        return (
            <div className={cx(styles.header, "page-header")}>
                <div className={cx(styles.campaignInfoWrapper)}>
                    <div className={cx(styles.campaignInfo)}>
                        <div className={cx(styles.campaignInfoInnerLeft)}>
                            <div className={cx(styles.campaignTitleInnerLeft)}>
                                <h1 className={styles.campaignTitle}>{title}</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <TrajectoryHeader
                    currentView={selectedTrajectoryView}
                />
            </div>
        )
    }

    return menu === "trajectories" ? renderHeaderTrajectory() : (
        <div className={cx(styles.header, "page-header")}>
            <div className={cx(styles.campaignInfoWrapper)}>
                <div className={cx(styles.campaignInfo)}>
                    <div className={cx(styles.campaignInfoInnerLeft)}>
                        <CampaignBradcrums url={menu} />
                        <div className={cx(styles.campaignTitleInnerLeft)}>
                            <h1 className={styles.campaignTitle}>{title}</h1>
                            <CampaignsDropdown
                                campaignName={campaign?.information?.name ?? " "}
                                basePath={menu}
                            />
                        </div>
                        <div className={styles.yearSelectorsContainer}>
                            <div className={styles.selectedYearField}>
                                <img className={styles.selectedYearIcon} src="/icons/icon-calendar-color-primary-2.svg" alt={t("global.common.calendar")} />
                                {upperFirst(t("global.time.year"))} :{" "}
                                <span className={cx(styles.selectedYear)}>
                                    {campaign?.information?.year ?? t("global.adjective.undefined.fem")}
                                </span>
                            </div>
                            <div className={styles.selectedYearField}>
                                <img className={styles.selectedYearIcon} src="/icons/icon-target-color-primary-2.svg" alt={t("global.common.target")} />
                                <span>{upperFirst(t("global.common.type"))} :{" "}</span>
                                <span className={styles.selectedYear}>{getCampaignTypeShortName(campaign?.information?.type ?? CampaignTypeEnum.CARBON_FOOTPRINT)}</span>
                            </div>
                            {
                              campaign?.information?.status && (
                                <div className={styles.selectedYearField}>
                                    <img className={styles.selectedYearIcon} src="/icons/icon-box-color-primary-2.svg" alt={t("global.common.target")} />
                                    <span>{upperFirst(t("status.status.singular"))} :{" "}</span>
                                    <span className={styles.selectedYear}>
                                        <CampaignStatusBadge status={campaign.information.status} />
                                    </span>
                                </div>
                              )
                            }
                        </div>
                    </div>
                    {menu !== "trajectories" && (
                        <div className={cx(styles.campaignInfoInnerRight)}>
                            {menu === "campaigns" && (
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
                            )}
                            {isCollaborator && (
                                <div className={cx(styles.campaignInfoResultBadge)}>
                                    <Tco2ResultBadge
                                        className={styles.campaignResults}
                                        resultTco2={entryInfoForHeaderTotal.tCo2}
                                        totalResultTco2={entryInfoTotal.tCo2}
                                        notExcludedResultTco2={notExcludedEntriesInfoTotal.tCo2}
                                        active={activeExcludedFilter}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
                {(campaignHasHiddenEmissions && menu === "campaigns") && (
                    <Tooltip content={upperFirst(t("emission.hiddenEmission"))}>
                        <div className={cx(styles.hasHiddenEmissionsBadge)}>
                            <i className="fa fa-exclamation-triangle"></i>
                        </div>
                    </Tooltip>
                )}
            </div>
            <div className={styles.tabsContainer}>
                <Tabs
                    className={styles.campaignTabs}
                    tabItems={availableTabs}
                    value={currentView}
                    onChange={onChange}
                />
                {menu === "campaigns" && (
                  <div className={styles.buttonContainer}>
                    <IfHasPerimeterRole role={PerimeterRole.PERIMETER_MANAGER}>
                        <Link
                        href={`/campaigns/${campaignId}/data-import`}
                        >
                            <a className={cx("button-1", styles.importLink)}>
                                <i className="fas fa-upload"></i>
                            </a>
                        </Link>
                    </IfHasPerimeterRole>
                    <DownloadCampaign campaignId={campaignId} />
                  </div>
                )}
            </div>
        </div>
    );
};

export default MainHeader;