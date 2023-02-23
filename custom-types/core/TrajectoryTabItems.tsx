import { t } from "i18next";
import { upperFirst } from "lodash";

export enum TrajectoryViewItem {
    DEFINITION = "DEFINITION",
    PROJECTION = "PROJECTION",
}

export const trajectoryTabItems = {
    [TrajectoryViewItem.DEFINITION]: upperFirst(t("trajectory.definition.definition")),
    [TrajectoryViewItem.PROJECTION]: upperFirst(t("trajectory.projection.projection")),
};

export enum ProjectionViewItem {
    CATEGORY = "CATEGORY",
    ACTIVITY_MODELS = "ACTIVITY_MODELS",
}

export const projectionTabItems = {
    [ProjectionViewItem.CATEGORY]: upperFirst(t("activity.category.category")),
    [ProjectionViewItem.ACTIVITY_MODELS]: upperFirst(t("activity.activities")),
};

export const possibleViews = [
    {
        label: upperFirst(t("activity.category.category")),
        value: ProjectionViewItem.CATEGORY
    },
    {
        label: upperFirst(t("activity.activities")),
        value: ProjectionViewItem.ACTIVITY_MODELS
    }
];
