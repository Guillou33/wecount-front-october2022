import React from "react";
import cx from 'classnames';
import styles from "@styles/dashboard/campaign/campaignDashboard.module.scss";
import { CampaignTrajectory } from "@reducers/trajectory/campaignTrajectories/campaignTrajectoriesReducer";
import ScopesReductionDashboard from "./ScopesReductionDashboard";
import { upperFirst } from "lodash";
import { t } from "i18next";

interface Props {
    currentTrajectory: CampaignTrajectory;
}

const MacroView = ({
    currentTrajectory
}: Props) => {
    return (
        <div className={styles.categoriesDashboardContainer}>
            <div className={styles.titleContainer}>
                <div className={styles.comparisonTitleWrapper}>
                    <p className={"title-2 color-1"}>{upperFirst(t("trajectory.definition.macroView"))}</p>
                </div>
            </div>
            <div className={cx(styles.overviewTableContainer, "mt-4")}>
                <ScopesReductionDashboard trajectory={currentTrajectory} />
            </div>
        </div>
    );
}

export default MacroView;