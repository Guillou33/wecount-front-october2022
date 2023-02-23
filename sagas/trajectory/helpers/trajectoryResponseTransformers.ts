import { ActionPlanResponse, CampaignTrajectoryResponse, PossibleAction } from "@lib/wecount-api/responses/apiResponses";
import {
  ActivityModelActionPlan,
  ActivityModelsActionPlan,
  CampaignTrajectory,
  CategoriesActionPlan,
  ActionPlan,
} from "@reducers/trajectory/campaignTrajectories/campaignTrajectoriesReducer";

export interface ActionPlanReformat {
  id: number;
  categoryId: number;
  campaignTrajectoryId: number;
  action: PossibleAction | null;
  createdAt: string;
  updatedAt: string;
  reduction: number | null;
  description: string | null;
  comments: string | null;
  activityModelId: number;
}

export function trajectoryResponseTransformer(
  trajectoryResponse: CampaignTrajectoryResponse
): CampaignTrajectory {
  /**
   * Fetch Action Plans for Category View ==> MAILLE DE DEFINITION DES LEVIERS (Catégorie)
   */
  const categoriesActionPlan = trajectoryResponse.actionPlans
    .filter(actionPlan => !actionPlan.activityModelId || typeof actionPlan.activityModelId === "undefined")
    .reduce(
      (acc, actionPlan) => {
        if (acc[actionPlan.categoryId] == null) {
          acc[actionPlan.categoryId] = [];
        }
        const { id, description, reduction, comments, action, createdAt, updatedAt } =
          actionPlan;
        acc[actionPlan.categoryId].push({
          id: id.toString(),
          createdAt: new Date(createdAt).getTime(),
          updatedAt: new Date(updatedAt).getTime(),
          description,
          reduction,
          comments,
          actionId: action?.id ?? null,
          saved: true,
        });
        return acc;
      },
      {} as CategoriesActionPlan
    );

  /**
   * Fetch Action Plans for Activities View ==> MAILLE DE DEFINITION DES LEVIERS (Activités)
   * 
   * Filter Action Plans where activity Models are presents
   * 
   */
  const activitiesActionPlan = trajectoryResponse.actionPlans
    .filter(actionPlan => actionPlan.activityModelId && typeof actionPlan.activityModelId !== "undefined")
    .sort((plan1, plan2) => {
      const plan1CategoryId = plan1.categoryId !== undefined ? plan1.categoryId : 0;
      const plan2CategoryId = plan2.categoryId !== undefined ? plan2.categoryId : 0;
      return (plan1CategoryId > plan2CategoryId) ? 1 : ((plan2CategoryId > plan1CategoryId) ? -1 : 0);
    });

  const transformActivityModelsActionPlan = (actionPlan: ActionPlanResponse): ActivityModelActionPlan => {
    const activityModelId = actionPlan.activityModelId !== undefined ? actionPlan.activityModelId : -1;
    const actionPlans = activitiesActionPlan
      .filter(actionPlan => actionPlan.activityModelId === activityModelId)
      .map((actionPlan): ActionPlan => {
        const { id, description, reduction, comments, action, createdAt, updatedAt } =
          actionPlan;
        return {
          id: id.toString(),
          createdAt: new Date(createdAt).getTime(),
          updatedAt: new Date(updatedAt).getTime(),
          description,
          reduction,
          comments,
          actionId: action?.id ?? null,
          saved: true,
        }
      });
    return {
      [activityModelId]: actionPlans
    };
  }

  // check if activityModels are already in object for activityModelsActionPlan
  const activityModelsVerified = Array<number>();

  const activityModelsActionPlan = activitiesActionPlan.reduce(
    (acc, actionPlan) => {
      if (acc[actionPlan.categoryId] == null) {
        acc[actionPlan.categoryId] = [];
      }
      if (typeof actionPlan.activityModelId !== "undefined") {
        if (!activityModelsVerified.includes(actionPlan.activityModelId)) {
          acc[actionPlan.categoryId].push(
            transformActivityModelsActionPlan(actionPlan)
          );
        }
      }
      activityModelsVerified.push(actionPlan.activityModelId);
      return acc;
    },
    {} as ActivityModelsActionPlan
  );


  return {
    id: trajectoryResponse.id,
    campaignId: trajectoryResponse.campaignId,
    categoriesActionPlan,
    activityModelsActionPlan,
    openedActionPlan: {},
    openedActivityModelActionPlan: {},
  };
}
