import React from "react";
import { useSelector } from "react-redux";
import { Scope } from "@custom-types/wecount-api/activity";
import styles from "@styles/campaign/detail/trajectory/categoryPlan.module.scss";
import { RootState } from "@reducers/index";
import { PossibleAction } from "@lib/wecount-api/responses/apiResponses";
import { ActivityModelActionPlan, CampaignTrajectory } from "@reducers/trajectory/campaignTrajectories/campaignTrajectoriesReducer";
import ActivitiesActionPlan from "./ActivitiesActionPlan";
import { ReductionInfoByActivityModel } from "@hooks/core/helpers/getReductionInfoByActivityModel";
import selectCartographyForCampaign from "@selectors/cartography/selectCartographyForCampaign";

interface Props {
    scope: Scope;
    id: number;
    trajectory: CampaignTrajectory;
    categoryId: number;
    possibleActions: PossibleAction[];
    activityModelsActionPlans: ActivityModelActionPlan[];
    activityModelReductionsInfo: ReductionInfoByActivityModel;
}

const ActivitiesView = ({
    scope,
    id,
    trajectory,
    categoryId,
    possibleActions,
    activityModelsActionPlans,
    activityModelReductionsInfo
}: Props) => {
    const cartography = useSelector((state: RootState) =>
        selectCartographyForCampaign(state, trajectory.campaignId)
    );

    const category = cartography[scope][id];

    const renderActivityModels = () => {
        return (
            <div className={styles.activityModelsContainer}>
                {category.activityModels
                    .map((activityModel) => {
                        return (
                            <ActivitiesActionPlan
                                key={activityModel.id}
                                activityModel={activityModel}
                                actionPlans={activityModelsActionPlans}
                                activityModelReductionsInfo={activityModelReductionsInfo}
                                trajectory={trajectory}
                                categoryId={categoryId}
                                possibleActions={possibleActions}
                                scope={scope}
                            />
                        );
                    })
                }
            </div>

        );
    };
    return renderActivityModels();
}

export default ActivitiesView;