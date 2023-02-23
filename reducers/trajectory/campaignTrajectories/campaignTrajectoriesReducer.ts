import { Scope } from "@custom-types/wecount-api/activity";
import { Action } from "@actions/trajectory/campaigntrajectories/campaignTrajectoriesAction";
import { CampaignTrajectoriesTypes } from "@actions/trajectory/campaigntrajectories/types";
import immer from "immer";
import { uniqueId } from "lodash";
import _ from "lodash";

export interface SavedActionPlan {
  id: string;
  createdAt: number;
  updatedAt: number;
  actionId: number | null;
  activityModelId: number | null;
  reduction: number | null;
  description: string | null;
  comments: string | null;
  saved: boolean;
}

export interface CampaignTrajectories {
  [trajectoryId: number]: CampaignTrajectory;
}

export interface CampaignTrajectory {
  id: number;
  campaignId: number;
  categoriesActionPlan: CategoriesActionPlan;
  activityModelsActionPlan: ActivityModelsActionPlan;
  openedActionPlan: {
    [categoryId: number]: true;
  };
  openedActivityModelActionPlan: {
    [categoryId: number]: {
      [activityModelId: number]: true;
    };
  };
}

export type ScopeTargets = {
  [scope in Scope]: { target: number | null; description: string | null };
};

export type CategoriesActionPlan = {
  [categoryId: number]: ActionPlan[];
};

export type ActivityModelsActionPlan = {
  [categoryId: number]: ActivityModelActionPlan[]
};

export interface ActionPlans {
  saved: ActionPlan[];
  unsaved: ActionPlan[];
}

export interface ActionPlan {
  id: string;
  createdAt: number;
  updatedAt: number;
  actionId: number | null;
  reduction: number | null;
  description: string | null;
  comments: string | null;
  saved: boolean;
}

export interface ActivityModelActionPlan {
  [activityModelId: number]: ActionPlan[]
}

const initialState: CampaignTrajectories = {};

export default function reducer(
  state: CampaignTrajectories = initialState,
  action: Action
): CampaignTrajectories {
  switch (action.type) {
    case CampaignTrajectoriesTypes.SET_CAMPAIGN_TRAJECTORY: {
      const { trajectory } = action.payload;
      return {
        ...state,
        [trajectory.id]: trajectory,
      };
    }

    case CampaignTrajectoriesTypes.TOGGLE_ACTION_PLAN: {
      const { trajectoryId, categoryId } = action.payload;
      return immer(state, draftState => {
        if (draftState[trajectoryId]?.openedActionPlan[categoryId]) {
          delete draftState[trajectoryId]?.openedActionPlan[categoryId];
        } else {
          draftState[trajectoryId].openedActionPlan[categoryId] = true;
        }
        if (draftState[trajectoryId]?.openedActivityModelActionPlan[categoryId]) {
          delete draftState[trajectoryId]?.openedActivityModelActionPlan[categoryId];
        } else {
          draftState[trajectoryId].openedActivityModelActionPlan[categoryId] = {};
        }
      });
    }

    case CampaignTrajectoriesTypes.TOGGLE_ACTIVITY_MODEL_ACTION_PLAN: {
      const { trajectoryId, categoryId, activityModelId } = action.payload;
      return immer(state, draftState => {
        if (draftState[trajectoryId]?.openedActivityModelActionPlan[categoryId][activityModelId]) {
          delete draftState[trajectoryId]?.openedActivityModelActionPlan[categoryId][activityModelId];
        } else {
          draftState[trajectoryId].openedActivityModelActionPlan[categoryId][activityModelId] = true;
        }
      });
    }

    case CampaignTrajectoriesTypes.ADD_BLANK_ACTION_PLAN: {
      const { trajectoryId, categoryId } = action.payload;
      return immer(state, draftState => {
        if (draftState[trajectoryId].categoriesActionPlan[categoryId] == null) {
          draftState[trajectoryId].categoriesActionPlan[categoryId] = [];
        }
        draftState[trajectoryId].categoriesActionPlan[categoryId].push({
          id: uniqueId("temp_"),
          createdAt: Date.now(),
          updatedAt: Date.now(),
          actionId: 0,
          comments: "",
          description: "",
          reduction: null,
          saved: false,
        });
      });
    }
    case CampaignTrajectoriesTypes.ADD_BLANK_ACTIVITY_MODEL_ACTION_PLAN: {
      const { trajectoryId, categoryId, activityModelId } = action.payload;
      return immer(state, draftState => {
        if (draftState[trajectoryId].activityModelsActionPlan[categoryId] === undefined) {
          draftState[trajectoryId].activityModelsActionPlan[categoryId] = [];
          draftState[trajectoryId].activityModelsActionPlan[categoryId].push({
            [activityModelId]: [
              {
                id: uniqueId("temp_"),
                createdAt: Date.now(),
                updatedAt: Date.now(),
                actionId: 0,
                comments: "",
                description: "",
                reduction: null,
                saved: false,
              }
            ]
          });
        } else {
          let activityModelActionPlans = draftState[trajectoryId].activityModelsActionPlan[categoryId]
            .filter(activityModel => activityModel[activityModelId])[0];
          if (activityModelActionPlans === undefined) {
            draftState[trajectoryId].activityModelsActionPlan[categoryId].push({
              [activityModelId]: [
                {
                  id: uniqueId("temp_"),
                  createdAt: Date.now(),
                  updatedAt: Date.now(),
                  actionId: 0,
                  comments: "",
                  description: "",
                  reduction: null,
                  saved: false,
                }
              ]
            });
          } else {
            activityModelActionPlans[activityModelId].push({
              id: uniqueId("temp_"),
              createdAt: Date.now(),
              updatedAt: Date.now(),
              actionId: 0,
              comments: "",
              description: "",
              reduction: null,
              saved: false,
            });
          }
        }
      });
    }

    case CampaignTrajectoriesTypes.SET_ACTION_PLAN: {
      const { trajectoryId, categoryId, activityModelId, actionPlan } = action.payload;
      return immer(state, draftState => {
        if (activityModelId) {
          if (draftState[trajectoryId].activityModelsActionPlan[categoryId] === undefined) {
            return;
          } else {
            let activityModelActionPlans = draftState[trajectoryId].activityModelsActionPlan[categoryId]
              .filter(activityModel => activityModel[activityModelId])[0];
            if (activityModelActionPlans === undefined) {
              return;
            } else {
              let planIndex = activityModelActionPlans[activityModelId]
                .findIndex(plan => plan.id === actionPlan.id);
              if (planIndex > -1) {
                activityModelActionPlans[activityModelId][planIndex] =
                  actionPlan;
              }
            }
          }
        } else {
          if (draftState[trajectoryId].categoriesActionPlan[categoryId] == null) {
            return;
          }
          let planIndex = draftState[trajectoryId].categoriesActionPlan[
            categoryId
          ].findIndex(plan => plan.id === actionPlan.id);
          if (planIndex > -1) {
            draftState[trajectoryId].categoriesActionPlan[categoryId][planIndex] =
              actionPlan;
          }
        }
      });
    }
    case CampaignTrajectoriesTypes.SET_ACTION_PLAN_CREATED_BY_API: {
      const { trajectoryId, categoryId, activityModelId, actionPlan, tempId } = action.payload;
      return immer(state, draftState => {
        if (activityModelId) {
          if (draftState[trajectoryId].activityModelsActionPlan[categoryId] === undefined) {
            return;
          } else {
            let activityModelActionPlans = draftState[trajectoryId].activityModelsActionPlan[categoryId]
              .filter(activityModel => activityModel[activityModelId])[0];
            if (activityModelActionPlans === undefined) {
              return;
            } else {
              let planIndex = state[trajectoryId].activityModelsActionPlan[categoryId]
                .filter(activityModel => activityModel[activityModelId])[0][activityModelId]
                .findIndex(plan => plan.id === tempId);
              if (planIndex > -1) {
                activityModelActionPlans[activityModelId][planIndex] =
                  actionPlan;
              }
            }
          }
        } else {
          if (draftState[trajectoryId].categoriesActionPlan[categoryId] == null) {
            return;
          }
          let planIndex = draftState[trajectoryId].categoriesActionPlan[
            categoryId
          ].findIndex(plan => plan.id === tempId);
          if (planIndex > -1) {
            draftState[trajectoryId].categoriesActionPlan[categoryId][planIndex] =
              actionPlan;
          }
        }
      });
    }
    case CampaignTrajectoriesTypes.REMOVE_ACTION_PLAN: {
      const { trajectoryId, categoryId, activityModelId, actionPlan } = action.payload;
      return immer(state, draftState => {
        if (activityModelId) {
          if (draftState[trajectoryId].activityModelsActionPlan[categoryId] === undefined) {
            return;
          } else {
            let activityModelActionPlans = draftState[trajectoryId].activityModelsActionPlan[categoryId]
              .filter(activityModel => activityModel[activityModelId])[0];
            if (activityModelActionPlans === undefined) {
              return;
            } else {
              activityModelActionPlans[activityModelId] = activityModelActionPlans[activityModelId].filter(
                plan => plan.id !== actionPlan.id
              );
              if (activityModelActionPlans[activityModelId].length === 0) {
                delete draftState[trajectoryId]?.openedActivityModelActionPlan[categoryId][activityModelId];
              }
            }
          }
        } else {
          if (draftState[trajectoryId].categoriesActionPlan[categoryId] == null) {
            return;
          }
          let currentActionPlans = draftState[trajectoryId].categoriesActionPlan;
          currentActionPlans[categoryId] = currentActionPlans[categoryId].filter(
            plan => plan.id !== actionPlan.id
          );
          if (currentActionPlans[categoryId].length === 0) {
            delete draftState[trajectoryId].openedActionPlan[categoryId];
          }
        }
      });
    }

    default:
      return state;
  }
}
