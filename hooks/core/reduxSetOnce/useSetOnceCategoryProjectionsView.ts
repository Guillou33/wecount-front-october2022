import { setCurrentProjectionView, setTrajectoryProjectionViews } from "@actions/trajectory/currentTrajectory/currentTrajectoryAction";
import { ProjectionViewItem } from "@components/campaign/detail/trajectory/helpers/TrajectoryTabItems";
import { CustomThunkDispatch } from "@custom-types/redux";
import { Scope } from "@custom-types/wecount-api/activity";
import { ActivityCategory, CategoryList } from "@reducers/core/categoryReducer";
import { RootState } from "@reducers/index";
import { ActionPlan, ActivityModelActionPlan, ActivityModelsActionPlan, CategoriesActionPlan } from "@reducers/trajectory/campaignTrajectories/campaignTrajectoriesReducer";
import { CategoryProjectionPossibleView, CurrentTrajectoryState } from "@reducers/trajectory/currentTrajectory/currentTrajectoryReducer";
import { useEffect } from "react";
import memoValue from "@lib/utils/memoValue";
import { useDispatch, useSelector } from "react-redux";
import { startEdit } from "@actions/activity/edit/editActions";
import _ from "lodash";

interface CategoryListItem {
    [key: number]: ActivityCategory
}

const checkLastUpdate = ({
    categoryActionPlans,
    activityModelsActionPlans,
    categoryId
}: {
    categoryActionPlans: CategoriesActionPlan;
    activityModelsActionPlans: ActivityModelsActionPlan;
    categoryId: number;
}) => {
    if(activityModelsActionPlans === undefined || activityModelsActionPlans[categoryId] === undefined){
        return ProjectionViewItem.CATEGORY;
    }else{
        if(categoryActionPlans[categoryId] === undefined){
            return ProjectionViewItem.ACTIVITY_MODELS;
        }else{
            const categoryUpdateDates = categoryActionPlans[categoryId].map(actionPlan => actionPlan.updatedAt);
            const activityModelsUpdateDates = activityModelsActionPlans[categoryId].map(activityModel => {
                return Object.values(activityModel)[0].map((actionPlan: ActionPlan) => actionPlan.updatedAt);
            }).flat();
            
            const maxCategoryUpdate = Math.max(...categoryUpdateDates);
            const maxActivityModelUpdate = Math.max(...activityModelsUpdateDates);

            return maxCategoryUpdate > maxActivityModelUpdate ? 
                ProjectionViewItem.CATEGORY : 
                ProjectionViewItem.ACTIVITY_MODELS;
        }
    }
}

const useSetOnceCategoryProjectionsView = (trajectoryId?: number | null) => {
    const categoryState = useSelector<RootState, CategoryList>(state => state.core.category.categoryList);
    
    const categoryActionPlans = useSelector<RootState, CategoriesActionPlan>(
        state => trajectoryId && trajectoryId !== undefined ? 
            state.trajectory.campaignTrajectories[trajectoryId]?.categoriesActionPlan : 
            {}
    );
    
    const activityModelsActionPlans = useSelector<RootState, ActivityModelsActionPlan>(
        state => trajectoryId && trajectoryId !== undefined ? 
            state.trajectory.campaignTrajectories[trajectoryId]?.activityModelsActionPlan : 
            {}
        );
    
    const categoryProjectionViews = useSelector<RootState, CategoryProjectionPossibleView[]>(
        state => trajectoryId === null ? 
            [] : 
            state.trajectory.currentTrajectory.categoryProjectionsViews[trajectoryId ?? -1] === undefined ? [] :
                state.trajectory.currentTrajectory.categoryProjectionsViews[trajectoryId ?? -1]
        );
    
    const dispatch = useDispatch() as CustomThunkDispatch;

    const scopeCategoriesIds = Object.values(categoryState).map((category: CategoryListItem) => {
        return Object.values(category).map((categoryInfo: ActivityCategory) => {
            return categoryInfo.id;
        });
    });

    const categoriesIds = memoValue(scopeCategoriesIds[0].concat(scopeCategoriesIds[1]).concat(scopeCategoriesIds[2]));

    useEffect(() => {
        if (
            trajectoryId === null || 
            categoryProjectionViews.length > 0 ||
            (_.isEmpty(categoryActionPlans) && _.isEmpty(activityModelsActionPlans))
        ) return;

        const views: CategoryProjectionPossibleView[] = []
        categoriesIds.forEach(categoryId => {
            const currentProjectionView = checkLastUpdate({
                categoryActionPlans,
                activityModelsActionPlans,
                categoryId
            });
            views.push({
                categoryId,
                currentProjectionView
            });
        });
        dispatch(setTrajectoryProjectionViews({
            trajectoryId: trajectoryId !== undefined ? trajectoryId : 0,
            categoryProjectionsViews: views
        }));
    }, [trajectoryId, categoryActionPlans, activityModelsActionPlans])
}

export default useSetOnceCategoryProjectionsView;