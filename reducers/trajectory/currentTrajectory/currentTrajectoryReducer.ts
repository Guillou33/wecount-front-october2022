import { Action } from "@actions/trajectory/currentTrajectory/currentTrajectoryAction";
import { CurrentTrajectoryTypes } from "@actions/trajectory/currentTrajectory/types";
import { Scope } from "@custom-types/wecount-api/activity";
import { ProjectionViewItem, TrajectoryViewItem } from "@components/campaign/detail/trajectory/helpers/TrajectoryTabItems";
import immer from "immer";


export interface CategoryProjectionPossibleView {
  categoryId: number;
  currentProjectionView: ProjectionViewItem;
};

export interface ViewsInTrajectory {
  [trajectoryId: number]: CategoryProjectionPossibleView[];
}

export interface CurrentTrajectoryState {
  currentTrajectoryView: TrajectoryViewItem;
  categoryProjectionsViews: ViewsInTrajectory;
  currentScope: Scope;
}

const initialStateForCategoryProjectionViews: {
  [trajectoryId: number]: CategoryProjectionPossibleView[]
} = {};

const initialState: CurrentTrajectoryState = {
  currentScope: Scope.UPSTREAM,
  currentTrajectoryView: TrajectoryViewItem.DEFINITION,
  categoryProjectionsViews: initialStateForCategoryProjectionViews,
};

function reducer(
  state: CurrentTrajectoryState = initialState,
  action: Action
): CurrentTrajectoryState {
  switch (action.type) {
    case CurrentTrajectoryTypes.SET_CURRENT_TRAJECTORY_VIEW:
      return { ...state, currentTrajectoryView: action.payload.currentTrajectoryView };

    case CurrentTrajectoryTypes.SET_TRAJECTORY_PROJECTION_VIEWS:
      return immer(state, draftState => {
        const trajectoryId = action.payload.trajectoryId;
        const categoryProjectionsViews = action.payload.categoryProjectionsViews;
        const currentProjectionViewsForTrajectory = state.categoryProjectionsViews[trajectoryId];
        if (currentProjectionViewsForTrajectory === undefined) {
          draftState.categoryProjectionsViews = {
            ...state.categoryProjectionsViews,
            [trajectoryId]: categoryProjectionsViews
          };
        }else {
          draftState.categoryProjectionsViews[trajectoryId] = categoryProjectionsViews;
        }
      });
      case CurrentTrajectoryTypes.SET_CURRENT_PROJECTION_VIEW:
        return immer(state, draftState => {
          const trajectoryId = action.payload.trajectoryId;
          const currentProjectionViewsForTrajectory = state.categoryProjectionsViews[trajectoryId];
            if (currentProjectionViewsForTrajectory === undefined) {
              draftState.categoryProjectionsViews = {
                ...state.categoryProjectionsViews,
                [trajectoryId]: [
                  {
                    categoryId: action.payload.categoryId,
                    currentProjectionView: action.payload.currentProjectionView
                  }
                ]
              };
            }else {
              const currentProjectionViewForCategory = state.categoryProjectionsViews[trajectoryId]
                .filter(projection => projection.categoryId === action.payload.categoryId)[0];
              if (currentProjectionViewForCategory === undefined) {
                  draftState.categoryProjectionsViews[trajectoryId].push({
                    categoryId: action.payload.categoryId,
                    currentProjectionView: action.payload.currentProjectionView
                  });
              } else {
                draftState.categoryProjectionsViews[trajectoryId]
                  .filter(projection => projection.categoryId === action.payload.categoryId)[0]
                  .currentProjectionView = action.payload.currentProjectionView;
              }
            }
        });  

    case CurrentTrajectoryTypes.SET_CURRENT_SCOPE:
      return { ...state, currentScope: action.payload.currentScope };

    default:
      return state;
  }
}

export default reducer;
