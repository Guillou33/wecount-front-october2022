import React from 'react';
import { useDispatch } from "react-redux";
import styles from "@styles/core/header.module.scss";

import { TrajectoryViewItem } from "@components/campaign/detail/trajectory/helpers/TrajectoryTabItems";
import Tabs from "@components/helpers/ui/Tabs";
import { setCurrentTrajectoryView } from "@actions/trajectory/currentTrajectory/currentTrajectoryAction";
import { upperFirst } from 'lodash';
import { t } from 'i18next';

type Props = {
    currentView: any;
};

const trajectoryTabItems = {
    [TrajectoryViewItem.DEFINITION]: upperFirst(t("trajectory.definition.definition")),
    [TrajectoryViewItem.PROJECTION]: upperFirst(t("trajectory.projection.projection")),
};

const TrajectoryHeader = ({
    currentView,
}: Props) => {
    const dispatch = useDispatch();

    const trajectoryTabs = Object.values(TrajectoryViewItem).map(item => ({
        label: trajectoryTabItems[item],
        value: item,
    }));

    return (
        <div className={styles.tabsContainer}>
            <Tabs
                className={styles.campaignTabs}
                tabItems={trajectoryTabs}
                value={currentView}
                onChange={view => dispatch(setCurrentTrajectoryView(view))}
            />
        </div>
    )
}

export default TrajectoryHeader;