import React from "react";
import cx from "classnames";
import styles from "@styles/campaign/detail/trajectory/trajectoryScopeOverview.module.scss";
import moment from "moment";
import { Campaign as CampaignType } from "@reducers/campaignReducer";
import { Scope } from "@custom-types/wecount-api/activity";
import { CampaignTrajectory } from "@reducers/trajectory/campaignTrajectories/campaignTrajectoriesReducer";
import TrajectoryOverviewContainer from "../macro/TrajectoryOverviewContainer";
import useReductionInfoByScopeSwitchDefinitionLevers from "@hooks/core/useReductionInfoByScopeSwitchDefinitionLevers";
import { TrajectorySettings } from "@reducers/trajectory/trajectorySettings/trajectorySettingsReducer";

type ScopeObject = {
    label: string;
    value: Scope;
}

interface Props {
    trajectory: CampaignTrajectory;
    targetYear: number | null;
    campaign: CampaignType;
    scope: ScopeObject;
}

const ScopeOverview = ({
    trajectory,
    targetYear,
    campaign,
    scope
}: Props) => {
    const year = campaign?.information?.year ?? parseInt(moment().format('YYYY'));

    return (
        <div className={cx(styles.chartScope)}>
            <TrajectoryOverviewContainer
                year={year}
                targetYear={targetYear}
                trajectory={trajectory}
                selectedScope={scope.value}
            />
        </div>
    )
}

export default ScopeOverview;