import cx from "classnames";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@reducers/index";
import { ActivityModelActionPlan, CampaignTrajectory, ActionPlan } from "@reducers/trajectory/campaignTrajectories/campaignTrajectoriesReducer";
import styles from "@styles/campaign/detail/trajectory/categoryPlan.module.scss";
import CategoryCard from "@components/campaign/detail/trajectory/CategoryCard";
import { SelectOne, Option } from "@components/helpers/ui/selects";
import { DefaultContainer } from "@components/helpers/ui/selects/selectionContainers";
import { Scope } from "@custom-types/wecount-api/activity";
import {
  toggleActionPlan,
  addBlankActionPlan,
} from "@actions/trajectory/campaigntrajectories/campaignTrajectoriesAction";
import Foldable from "@components/helpers/form/Foldable";
import CategoryActionPlanView from "@components/campaign/detail/trajectory/CategoryPlan/CategoryActionPlanView";
import { PossibleAction } from "@lib/wecount-api/responses/apiResponses";
import useReductionInfoByCategory from "@hooks/core/useReductionInfoByCategory";
import { ActivityModel } from "@reducers/core/categoryReducer";
import useReadOnlyAccessControl from "@hooks/core/readOnlyMode/useReadOnlyAccessControl";
import { ProjectionViewItem } from "@components/campaign/detail/trajectory/helpers/TrajectoryTabItems";
import useReductionInfoByActivityModel from "@hooks/core/useReductionInfoByActivityModel";
import { getLengthOfCategoryActionPlansWithActivityModels } from "../utils/calculateActivityModelsActionPlan";
import ActivitiesView from "../ActivitiesPlan/ActivitiesView";
import { setCurrentProjectionView } from "@actions/trajectory/currentTrajectory/currentTrajectoryAction";
import { upperFirst } from "lodash";
import { t } from "i18next";

interface Props {
  trajectory: CampaignTrajectory;
  categoryId: number;
  preferencesFetched: boolean;
  scope: Scope;
}

const possibleViews = [
  {
      label: upperFirst(t("activity.category.category")),
      value: ProjectionViewItem.CATEGORY
  },
  {
      label: upperFirst(t("activity.activities")),
      value: ProjectionViewItem.ACTIVITY_MODELS
  }
];

const CategoryView = ({
  categoryId,
  preferencesFetched,
  scope,
  trajectory,
}: Props) => {
  const dispatch = useDispatch();
  const withReadOnlyAccessControl = useReadOnlyAccessControl();

  const [viewId, setViewId] = React.useState(0);

  const categoryReductionsInfo = useReductionInfoByCategory(trajectory.id);
  const categoryReductionInfo = categoryReductionsInfo[categoryId];

  const activityModelReductionsInfo = useReductionInfoByActivityModel(trajectory.id);

  const isOpened = useSelector<RootState, boolean>(
    state =>
      state.trajectory.campaignTrajectories[trajectory.id]?.openedActionPlan[
      categoryId
      ]
  );
  const categoryActionPlans = useSelector<RootState, ActionPlan[]>(
    state =>
      state.trajectory.campaignTrajectories[trajectory.id]?.categoriesActionPlan[
      categoryId
      ] ?? []
  );

  const activityModelsActionPlans = useSelector<RootState, ActivityModelActionPlan[]>(
    state =>
      state.trajectory.campaignTrajectories[trajectory.id]?.activityModelsActionPlan[
      categoryId
      ] ?? []
  );

  const possibleActions = useSelector<RootState, PossibleAction[]>(
    state => state.core.category.categoryList[scope][categoryId].possibleActions
  );

  const activityModelsInCategory = useSelector<RootState, ActivityModel[]>(
    state => state.core.category.categoryList[scope][categoryId].activityModels
  );

  const helpIframe = useSelector<RootState, string | null>(
    state => state.core.category.categoryList[scope][categoryId].actionPlanHelp
  );

  const categoryView = useSelector<RootState, ProjectionViewItem>(
    state => state.trajectory.currentTrajectory.categoryProjectionsViews === undefined ? 
      ProjectionViewItem.CATEGORY : 
        state.trajectory.currentTrajectory.categoryProjectionsViews[trajectory.id] === undefined ? 
        ProjectionViewItem.CATEGORY : 
          state.trajectory.currentTrajectory.categoryProjectionsViews[trajectory.id]
            .filter(projectionView => projectionView.categoryId === categoryId)[0] === undefined ?
            ProjectionViewItem.CATEGORY :
            state.trajectory.currentTrajectory.categoryProjectionsViews[trajectory.id]
              .filter(projectionView => projectionView.categoryId === categoryId)[0]
              .currentProjectionView
  );

  const toggleCategoryPlan = () => {
    if (categoryActionPlans.length === 0) {
      dispatch(addBlankActionPlan(trajectory.id, categoryId));
    }
    dispatch(toggleActionPlan(trajectory.id, categoryId));
  };

  const renderCategoryView = () => {
    return (
      <>
        <div className={cx(styles.actionPlansContainer)}>
          <div className={cx(styles.actionPlans, "default-field")}>
            <div className={styles.gridLabel}></div>
            <div className={styles.gridLabel}>{upperFirst(t("trajectory.projection.actionPlan.lever.lever"))}</div>
            <div className={cx(styles.gridLabel)}>
                {upperFirst(t("trajectory.projection.actionPlan.comment.comment"))}
            </div>
            <div className={cx(styles.gridLabel, styles.gridLastLabel)}>{upperFirst(t("trajectory.projection.actionPlan.lever.impact"))}</div>
            {categoryActionPlans.map(actionPlan => {
              const actionPlanReduction =
                categoryReductionInfo.actionPlansReductions[actionPlan.id];
              return (
                <CategoryActionPlanView
                  key={actionPlan.id}
                  actionPlanData={actionPlan}
                  trajectoryId={trajectory.id}
                  categoryId={categoryId}
                  computedReduction={
                    actionPlanReduction.reductionPercentageOfScope
                  }
                  computedTco2={actionPlanReduction.reductionTco2}
                  possibleActions={possibleActions}
                  scope={scope}
                />
              );
            })}
          </div>
          <div>
            <button
              className={cx("button-1", styles.addActionButton)}
              onClick={withReadOnlyAccessControl(() => {
                dispatch(addBlankActionPlan(trajectory.id, categoryId));
                if (!isOpened) {
                  dispatch(toggleActionPlan(trajectory.id, categoryId));
                }
              })}
            >
              + {upperFirst(t("trajectory.projection.actionPlan.lever.add"))}
            </button>
          </div>
        </div>
      </>
    );
  }

  const renderActivityModelsView = () => {
    return (
      <ActivitiesView
        id={categoryId}
        scope={scope}
        trajectory={trajectory}
        categoryId={categoryId}
        possibleActions={possibleActions}
        activityModelsActionPlans={activityModelsActionPlans}
        activityModelReductionsInfo={activityModelReductionsInfo}
      />
    )
  }

  return (
    <div className={styles.categoryPlan}>
      <div className={styles.categoryPlanHeader}>
        <CategoryCard
          key={categoryId}
          id={categoryId}
          scope={scope}
          preferencesFetched={preferencesFetched}
          onClick={toggleCategoryPlan}
          className={styles.category}
          isOpen={isOpened}
          view={categoryView}
          categoryReductionInfo={categoryReductionInfo}
          activityModelsInCategory={activityModelsInCategory}
          activityModelReductionsInfo={activityModelReductionsInfo}
          nbrLevers={
            categoryView === ProjectionViewItem.CATEGORY ?
              categoryActionPlans.length :
              getLengthOfCategoryActionPlansWithActivityModels(activityModelsActionPlans)
          }
        />
      </div>
      <Foldable isOpen={isOpened}>
        <>
          <div className={cx(styles.definitionLever)}>
            <h2 className={cx(styles.labelDefinitionLever)}>
              {upperFirst(t("trajectory.projection.actionPlan.lever.ladder"))}
            </h2>
            <SelectOne
              selected={categoryView}
              onOptionClick={(view) => {
                dispatch(setCurrentProjectionView({
                  trajectoryId: trajectory.id,
                  categoryId,
                  currentProjectionView: view
                }));
              }}
              placeholder={possibleViews[viewId].label}
              renderSelectionContainer={({ children, ...ctx }) => (
                <DefaultContainer {...ctx}>
                  <div className={styles.view}>{children}</div>
                </DefaultContainer>
              )}
            >
              {ctx => (
                <>
                  {possibleViews.map(view => (
                    <Option {...ctx} value={view.value} key={view.value}>
                      {view.label}
                    </Option>
                  ))}
                </>
              )}
            </SelectOne>
          </div>
          {helpIframe && (
            <div className={styles.helpContainer}>
              <i
                className={cx("far fa-question-circle", styles.helpIcon)}
              ></i>
              <span className={styles.helpText}>
                {upperFirst(t("help.fillData"))} ?
              </span>
              <a
                href={helpIframe ?? ""}
                target="_blank"
                className={styles.helpLink}
              >
                {t("global.see")}
              </a>
            </div>
          )}
          {categoryView === ProjectionViewItem.CATEGORY && renderCategoryView()}
          {categoryView === ProjectionViewItem.ACTIVITY_MODELS && renderActivityModelsView()}
        </>
      </Foldable>
    </div>
  );
};

export default CategoryView;
