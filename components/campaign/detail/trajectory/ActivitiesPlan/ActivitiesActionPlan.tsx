import React from "react";
import { ActivityModel as ActivityModelType } from "@reducers/core/categoryReducer";
import Foldable from "@components/helpers/form/Foldable";
import { ActivityModelActionPlan, CampaignTrajectory } from "@reducers/trajectory/campaignTrajectories/campaignTrajectoriesReducer";
import cx from "classnames";
import styles from "@styles/campaign/detail/trajectory/categoryPlan.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@reducers/index";
import { addBlankActivityModelActionPlan, toggleActivityModelActionPlan } from "@actions/trajectory/campaigntrajectories/campaignTrajectoriesAction";
import _, { upperFirst } from "lodash";
import { ReductionInfoByActivityModel } from "@hooks/core/helpers/getReductionInfoByActivityModel";
import { PossibleAction } from "@lib/wecount-api/responses/apiResponses";
import { Scope } from "@custom-types/wecount-api/activity";
import ActivityModel from "./ActivityModel";
import ActivityModelActionPlanView from "./ActivityModelActionPlanView";
import { t } from "i18next";

interface Props {
    activityModel: ActivityModelType;
    actionPlans: ActivityModelActionPlan[];
    activityModelReductionsInfo: ReductionInfoByActivityModel;
    trajectory: CampaignTrajectory;
    categoryId: number;
    possibleActions: PossibleAction[];
    scope: Scope;
}

const ActivitiesActionPlan = ({
    activityModel,
    actionPlans,
    activityModelReductionsInfo,
    trajectory,
    categoryId,
    possibleActions,
    scope
}: Props) => {
    const dispatch = useDispatch();

    const isOpened = useSelector<RootState, boolean>(
        state => state.trajectory.campaignTrajectories[trajectory.id]?.openedActivityModelActionPlan
        [categoryId] === undefined ? false :
            state.trajectory.campaignTrajectories[trajectory.id]?.openedActivityModelActionPlan
            [categoryId][activityModel.id]
    );

    const actionPlansInActivityModel = actionPlans
        .filter(actionPlan => actionPlan[activityModel.id])
        .map(actionPlan => {
            return actionPlan[activityModel.id];
        });

    const reductionPercentageOfTotal = activityModelReductionsInfo[activityModel.id] === undefined ? 0 :
        activityModelReductionsInfo[activityModel.id].reductionPercentageOfTotal;
    const reductionPercentageOfScope = activityModelReductionsInfo[activityModel.id] === undefined ? 0 :
        activityModelReductionsInfo[activityModel.id].reductionPercentageOfScope;
    const reductionTco2 = activityModelReductionsInfo[activityModel.id] === undefined ? 0 :
        activityModelReductionsInfo[activityModel.id].reductionTco2;

    const toggleActivityModelPlan = () => {
        if (actionPlansInActivityModel.length === 0) {
            dispatch(addBlankActivityModelActionPlan(trajectory.id, categoryId, activityModel.id));
        }
        dispatch(toggleActivityModelActionPlan(trajectory.id, categoryId, activityModel.id));
    };

    const possibleActionsInActivityModels = useSelector<RootState, PossibleAction[]>(
      state => state.core.category.categoryList[scope][categoryId].activityModels.filter(am => am.id === activityModel.id) === undefined ?
        possibleActions :
        state.core.category.categoryList[scope][categoryId].activityModels.filter(am => am.id === activityModel.id)[0].possibleActions
    );

    const renderActivityModelActionPlans = (activityModel: ActivityModelType) => {
        const activityModelReductionInfo = activityModelReductionsInfo[activityModel.id];
        return actionPlansInActivityModel.map(arrayActionPlan => {
            return arrayActionPlan.map(actionPlan => {
                let actionPlanReduction = {
                    actionPlanId: "0",
                    reductionPercentageOfScope: 0,
                    reductionPercentageOfTotal: 0,
                    reductionTco2: 0
                };
                if (
                    activityModelReductionInfo === undefined ||
                    activityModelReductionInfo.actionPlansReductions[parseInt(actionPlan.id)] === undefined
                ) {
                    actionPlanReduction = {
                        actionPlanId: "0",
                        reductionPercentageOfScope: 0,
                        reductionPercentageOfTotal: 0,
                        reductionTco2: 0
                    };
                } else {
                    actionPlanReduction = activityModelReductionInfo.actionPlansReductions[parseInt(actionPlan.id)];
                }
                return (
                    <ActivityModelActionPlanView
                        key={actionPlan.id}
                        activityModelId={activityModel.id}
                        categoryIsOpen={isOpened}
                        actionPlanData={actionPlan}
                        trajectoryId={trajectory.id}
                        categoryId={categoryId}
                        computedReduction={
                            actionPlanReduction.reductionPercentageOfScope
                        }
                        computedTco2={
                            actionPlanReduction.reductionTco2
                        }
                        possibleActions={
                            possibleActionsInActivityModels.length > 0 ? possibleActionsInActivityModels : possibleActions
                        }
                        scope={scope}
                    />
                );
            });
        });
    }

    return (
        <>
            <div onClick={toggleActivityModelPlan} className={cx(styles.activityModelCard)}>
                <ActivityModel
                    key={activityModel.id}
                    id={activityModel.id}
                    nbrActionPlans={actionPlansInActivityModel[0] !== undefined ? actionPlansInActivityModel[0].length : 0}
                    reductionPercentageOfScope={reductionPercentageOfScope}
                    reductionTco2={reductionTco2}
                    scope={scope}
                />
            </div>
            <Foldable isOpen={isOpened}>
                <div className={cx(styles.actionPlansContainer)}>
                    {(actionPlans !== undefined && actionPlans.length > 0) && (
                        <div className={cx(styles.actionPlans)}>
                            <div className={styles.gridLabel}></div>
                            <div className={styles.gridLabel}>{upperFirst(t("trajectory.projection.actionPlan.lever.lever"))}</div>
                            <div className={cx(styles.gridLabel)}>
                                {upperFirst(t("trajectory.projection.actionPlan.comment.comment"))}
                            </div>
                            <div className={cx(styles.gridLabel, styles.gridLastLabel)}>{upperFirst(t("trajectory.projection.actionPlan.lever.impact"))}</div>

                            {(actionPlans !== undefined && actionPlans.length > 0) && renderActivityModelActionPlans(activityModel)}
                        </div>
                    )}
                    <button
                        className={cx("button-1", styles.addActionButton)}
                        // onClick={withReadOnlyAccessControl(() => {
                        //     dispatch(addBlankActivityModelActionPlan(trajectory.id, categoryId, activityModel.id));
                        //     if (!isOpened) {
                        //         dispatch(toggleActivityModelActionPlan(trajectory.id, categoryId, activityModel.id));
                        //     }
                        // })}
                        onClick={() => {
                            dispatch(addBlankActivityModelActionPlan(trajectory.id, categoryId, activityModel.id));
                            if (!isOpened) {
                                dispatch(toggleActivityModelActionPlan(trajectory.id, categoryId, activityModel.id));
                            }
                        }}
                    >
                        + {upperFirst(t("trajectory.projection.actionPlan.lever.add"))}
                    </button>
                </div>
            </Foldable>
        </>
    )

}

export default ActivitiesActionPlan;