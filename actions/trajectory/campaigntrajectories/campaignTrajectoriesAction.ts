import { CampaignTrajectoriesTypes } from "@actions/trajectory/campaigntrajectories/types";
import {
  CampaignTrajectory,
  ActionPlan,
} from "@reducers/trajectory/campaignTrajectories/campaignTrajectoriesReducer";
import { Scope } from "@custom-types/wecount-api/activity";

export type Action =
  | SetCampaignTrajectory
  | ToggleActionPlan
  | ToggleActivityModelActionPlan
  | AddBlankActionPlan
  | AddBlankActivityModelActionPlan
  | SetActionPlan
  | RequestSaveActionPlan
  | SetActionPlanCreatedByApi
  | RequestDeleteActionPlan
  | RemoveActionPlan;

interface SetCampaignTrajectory {
  type: CampaignTrajectoriesTypes.SET_CAMPAIGN_TRAJECTORY;
  payload: {
    trajectory: CampaignTrajectory;
  };
}

interface ToggleActionPlan {
  type: CampaignTrajectoriesTypes.TOGGLE_ACTION_PLAN;
  payload: {
    trajectoryId: number;
    categoryId: number;
  };
}

interface ToggleActivityModelActionPlan {
  type: CampaignTrajectoriesTypes.TOGGLE_ACTIVITY_MODEL_ACTION_PLAN;
  payload: {
    trajectoryId: number;
    categoryId: number;
    activityModelId: number;
  };
}

interface AddBlankActionPlan {
  type: CampaignTrajectoriesTypes.ADD_BLANK_ACTION_PLAN;
  payload: {
    trajectoryId: number;
    categoryId: number;
  };
}

interface AddBlankActivityModelActionPlan {
  type: CampaignTrajectoriesTypes.ADD_BLANK_ACTIVITY_MODEL_ACTION_PLAN;
  payload: {
    trajectoryId: number;
    categoryId: number;
    activityModelId: number;
  };
}

interface SetActionPlan {
  type: CampaignTrajectoriesTypes.SET_ACTION_PLAN;
  payload: {
    trajectoryId: number;
    categoryId: number;
    activityModelId: number | null;
    actionPlan: ActionPlan;
  };
}

interface SetActionPlanCreatedByApi {
  type: CampaignTrajectoriesTypes.SET_ACTION_PLAN_CREATED_BY_API;
  payload: {
    trajectoryId: number;
    categoryId: number;
    activityModelId: number | null;
    tempId: string;
    actionPlan: ActionPlan;
  };
}

export interface RequestDeleteActionPlan {
  type: CampaignTrajectoriesTypes.REQUEST_DELETE_ACTION_PLAN;
  payload: {
    trajectoryId: number;
    categoryId: number;
    activityModelId: number | null;
    actionPlan: ActionPlan;
  };
}

interface RemoveActionPlan {
  type: CampaignTrajectoriesTypes.REMOVE_ACTION_PLAN;
  payload: {
    trajectoryId: number;
    categoryId: number;
    activityModelId: number | null;
    actionPlan: ActionPlan;
  };
}

export interface RequestTrajectory {
  type: CampaignTrajectoriesTypes.REQUEST_TRAJECTORY;
  payload: {
    id: number;
  };
}

export interface RequestCreateTrajectory {
  type: CampaignTrajectoriesTypes.REQUEST_CREATE_TRAJECTORY;
  payload: {
    campaignId: number;
  };
}

export interface RequestSaveActionPlan {
  type: CampaignTrajectoriesTypes.REQUEST_SAVE_ACTION_PLAN;
  payload: {
    trajectoryId: number;
    categoryId: number;
    activityModelId: number | null,
    actionPlan: ActionPlan;
  };
}

export function setCampaignTrajectory(
  trajectory: CampaignTrajectory
): SetCampaignTrajectory {
  return {
    type: CampaignTrajectoriesTypes.SET_CAMPAIGN_TRAJECTORY,
    payload: {
      trajectory,
    },
  };
}

export function toggleActionPlan(
  trajectoryId: number,
  categoryId: number,
): ToggleActionPlan {
  return {
    type: CampaignTrajectoriesTypes.TOGGLE_ACTION_PLAN,
    payload: {
      trajectoryId,
      categoryId,
    },
  };
}

export function toggleActivityModelActionPlan(
  trajectoryId: number,
  categoryId: number,
  activityModelId: number,
): ToggleActivityModelActionPlan {
  return {
    type: CampaignTrajectoriesTypes.TOGGLE_ACTIVITY_MODEL_ACTION_PLAN,
    payload: {
      trajectoryId,
      categoryId,
      activityModelId,
    },
  };
}

export function addBlankActionPlan(
  trajectoryId: number,
  categoryId: number
): AddBlankActionPlan {
  return {
    type: CampaignTrajectoriesTypes.ADD_BLANK_ACTION_PLAN,
    payload: {
      trajectoryId,
      categoryId,
    },
  };
}

export function addBlankActivityModelActionPlan(
  trajectoryId: number,
  categoryId: number,
  activityModelId: number
): AddBlankActivityModelActionPlan {
  return {
    type: CampaignTrajectoriesTypes.ADD_BLANK_ACTIVITY_MODEL_ACTION_PLAN,
    payload: {
      trajectoryId,
      categoryId,
      activityModelId
    },
  };
}

export function setActionPlan(
  trajectoryId: number,
  categoryId: number,
  activityModelId: number | null,
  actionPlan: ActionPlan
): SetActionPlan {
  return {
    type: CampaignTrajectoriesTypes.SET_ACTION_PLAN,
    payload: {
      trajectoryId,
      categoryId,
      activityModelId,
      actionPlan,
    },
  };
}

export function setActionPlanCreatedByApi(
  trajectoryId: number,
  categoryId: number,
  activityModelId: number | null,
  tempId: string,
  actionPlan: ActionPlan
): SetActionPlanCreatedByApi {
  return {
    type: CampaignTrajectoriesTypes.SET_ACTION_PLAN_CREATED_BY_API,
    payload: {
      trajectoryId,
      categoryId,
      activityModelId,
      actionPlan,
      tempId,
    },
  };
}

export function requestTrajectory(id: number): RequestTrajectory {
  return {
    type: CampaignTrajectoriesTypes.REQUEST_TRAJECTORY,
    payload: {
      id,
    },
  };
}

export function requestCreateTrajectory(
  campaignId: number
): RequestCreateTrajectory {
  return {
    type: CampaignTrajectoriesTypes.REQUEST_CREATE_TRAJECTORY,
    payload: {
      campaignId,
    },
  };
}

export function requestSaveActionPlan(
  trajectoryId: number,
  categoryId: number,
  activityModelId: number | null,
  actionPlan: ActionPlan
): RequestSaveActionPlan {
  return {
    type: CampaignTrajectoriesTypes.REQUEST_SAVE_ACTION_PLAN,
    payload: {
      trajectoryId,
      categoryId,
      activityModelId,
      actionPlan,
    },
  };
}

export function requestDeleteActionPlan(
  trajectoryId: number,
  categoryId: number,
  activityModelId: number | null,
  actionPlan: ActionPlan
): RequestDeleteActionPlan {
  return {
    type: CampaignTrajectoriesTypes.REQUEST_DELETE_ACTION_PLAN,
    payload: {
      trajectoryId,
      categoryId,
      activityModelId,
      actionPlan,
    },
  };
}

export function removeActionPlan(
  trajectoryId: number,
  categoryId: number,
  activityModelId: number | null,
  actionPlan: ActionPlan
): RemoveActionPlan {
  return {
    type: CampaignTrajectoriesTypes.REMOVE_ACTION_PLAN,
    payload: {
      trajectoryId,
      categoryId,
      activityModelId,
      actionPlan,
    },
  };
}
