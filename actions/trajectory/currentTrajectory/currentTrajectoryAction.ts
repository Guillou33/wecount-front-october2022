import { CurrentTrajectoryTypes } from "@actions/trajectory/currentTrajectory/types";
import { ProjectionViewItem, TrajectoryViewItem } from "@components/campaign/detail/trajectory/helpers/TrajectoryTabItems";
import { Scope } from "@custom-types/wecount-api/activity";
import { CategoryProjectionPossibleView } from "@reducers/trajectory/currentTrajectory/currentTrajectoryReducer";

export type Action =
  SetCurrentTrajectoryView |
  SetTrajectoryProjectionViews |
  SetCurrentProjectionView |
  SetCurrentScope;

export interface SetCurrentTrajectoryView {
  type: CurrentTrajectoryTypes.SET_CURRENT_TRAJECTORY_VIEW;
  payload: {
    currentTrajectoryView: TrajectoryViewItem;
  };
}

export function setCurrentTrajectoryView(currentTrajectoryView: TrajectoryViewItem): SetCurrentTrajectoryView {
  return {
    type: CurrentTrajectoryTypes.SET_CURRENT_TRAJECTORY_VIEW,
    payload: {
      currentTrajectoryView,
    },
  };
}

export interface SetTrajectoryProjectionViews {
  type: CurrentTrajectoryTypes.SET_TRAJECTORY_PROJECTION_VIEWS;
  payload: {
    trajectoryId: number;
    categoryProjectionsViews: CategoryProjectionPossibleView[];
  };
}

export function setTrajectoryProjectionViews({
  trajectoryId,
  categoryProjectionsViews
}: {
  trajectoryId: number;
  categoryProjectionsViews: CategoryProjectionPossibleView[];
}): SetTrajectoryProjectionViews {
  return {
    type: CurrentTrajectoryTypes.SET_TRAJECTORY_PROJECTION_VIEWS,
    payload: {
      trajectoryId,
      categoryProjectionsViews
    },
  };
}

export interface SetCurrentProjectionView {
  type: CurrentTrajectoryTypes.SET_CURRENT_PROJECTION_VIEW;
  payload: {
    trajectoryId: number;
    categoryId: number,
    currentProjectionView: ProjectionViewItem;
  };
}

export function setCurrentProjectionView({
  trajectoryId,
  categoryId,
  currentProjectionView
}: {
  trajectoryId: number,
  categoryId: number,
  currentProjectionView: ProjectionViewItem
}): SetCurrentProjectionView {
  return {
    type: CurrentTrajectoryTypes.SET_CURRENT_PROJECTION_VIEW,
    payload: {
      trajectoryId,
      categoryId,
      currentProjectionView,
    },
  };
}


export interface SetCurrentScope {
  type: CurrentTrajectoryTypes.SET_CURRENT_SCOPE;
  payload: {
    currentScope: Scope;
  };
}

export function setCurrentScope(currentScope: Scope): SetCurrentScope {
  return {
    type: CurrentTrajectoryTypes.SET_CURRENT_SCOPE,
    payload: {
      currentScope,
    },
  };
}
