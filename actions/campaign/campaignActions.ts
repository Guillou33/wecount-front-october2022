import { CampaignTypes } from "@actions/campaign/types";
import { CampaignStatus } from "@custom-types/core/CampaignStatus";
import { CampaignType } from "@custom-types/core/CampaignType";
import { CustomThunkAction, CustomThunkDispatch } from "@custom-types/redux";
import ApiClient from "@lib/wecount-api/ApiClient";
import {
  CampaignResponse,
  CampaignsResponse,
  CampaignWithActivitiesResponse
} from "@lib/wecount-api/responses/apiResponses";
import { ApiRoutes, generateRoute } from "@lib/wecount-api/routes/apiRoutes";
import { ActivitiesWithCampaignId, ActivityEntry, UnitModes } from "@reducers/campaignReducer";
import { Dispatch } from "redux";

export type Action =
  | SetInformationAction
  | SetCurrentCampaign
  | UnfoundCampaign
  | UpdateCampaign
  | SetAllInformationAction
  | ChangeCampaignUnitModeAction
  | SetActivitiesForMultipleCampaigns
  | SetTrajectories
  | ResetCampaignState
  | NewCampaignTypeUpdatedAction
  | NewCampaignNameUpdatedAction
  | NewCampaignYearUpdatedAction
  | NewCampaignTemplateUpdatedAction
  | NewCampaignWithTemplateValuesUpdatedAction
  | NewCampaignModalResetAction
  ;

interface ChangeCampaignUnitModeAction {
  type: CampaignTypes.CHANGE_CAMPAIGN_UNIT_MODE;
  payload: {
    campaignId: number;
    newUnitMode: UnitModes;
  };
}

interface SetAllInformationAction {
  type: CampaignTypes.SET_ALL_INFORMATION;
  payload: CampaignResponse[];
}

interface SetInformationAction {
  type: CampaignTypes.SET_INFORMATION;
  payload: {
    campaignId: number;
    information: CampaignResponse;
  };
}

interface UpdateCampaign {
  type: CampaignTypes.UPDATE_CAMPAIGN;
  payload: {
    campaignId: number;
    name: string;
    description: string | null;
    year: number;
    targetYear: number | null;
    status: CampaignStatus;
    type: CampaignType;
  };
}


export interface SetCurrentCampaign {
  type: CampaignTypes.SET_CURRENT_CAMPAIGN;
  payload: number;
}

interface UnfoundCampaign {
  type: CampaignTypes.UNFOUND_CAMPAIGN;
  payload: number;
}

interface SetActivitiesForMultipleCampaigns {
  type: CampaignTypes.SET_ACTIVITIES_FOR_MULTIPLE_CAMPAIGNS;
  payload: ActivitiesWithCampaignId[];
}

interface SetTrajectories {
  type: CampaignTypes.SET_TRAJECTORIES;
  payload: {
    campaignId: number;
    trajectoryIds: number[];
  };
}

interface ResetCampaignState {
  type: CampaignTypes.RESET_CAMPAIGN_STATE;
}

interface NewCampaignTypeUpdatedAction {
  type: CampaignTypes.NEW_CAMPAIGN_TYPE;
  payload: {
    type: CampaignType;
  }
}

interface NewCampaignNameUpdatedAction {
  type: CampaignTypes.NEW_CAMPAIGN_NAME;
  payload: {
    name: string;
  }
}

interface NewCampaignYearUpdatedAction {
  type: CampaignTypes.NEW_CAMPAIGN_YEAR;
  payload: {
    year: number;
  }
}

interface NewCampaignTemplateUpdatedAction {
  type: CampaignTypes.NEW_CAMPAIGN_TEMPLATE;
  payload: {
    templateId: number | undefined;
  }
}
interface NewCampaignWithTemplateValuesUpdatedAction {
  type: CampaignTypes.NEW_CAMPAIGN_WITH_TEMPLATE_VALUES;
  payload: {
    withTemplateValues: boolean;
  }
}

interface NewCampaignModalResetAction {
  type: CampaignTypes.NEW_CAMPAIGN_MODAL_RESET;
}

type ActivitiesEntries = {
  [key: number]: ActivityEntry[];
}

export const changeCampaignUnitMode = (campaignId: number, newUnitMode: UnitModes): ChangeCampaignUnitModeAction => ({
  type: CampaignTypes.CHANGE_CAMPAIGN_UNIT_MODE,
  payload: {
    campaignId,
    newUnitMode,
  }
});

export const newCampaignUpdateName = (
  name: string,
): NewCampaignNameUpdatedAction => {
  return {
    type: CampaignTypes.NEW_CAMPAIGN_NAME,
    payload: {
      name,
    },
  };
};

export const newCampaignUpdateType = (
  type: CampaignType,
): NewCampaignTypeUpdatedAction => {
  return {
    type: CampaignTypes.NEW_CAMPAIGN_TYPE,
    payload: {
      type,
    },
  };
};

export const newCampaignUpdateTemplate = (
  templateId: number | undefined,
): NewCampaignTemplateUpdatedAction => {
  return {
    type: CampaignTypes.NEW_CAMPAIGN_TEMPLATE,
    payload: {
      templateId,
    },
  };
};

export const newCampaignUpdateYear = (
  year: number,
): NewCampaignYearUpdatedAction => {
  return {
    type: CampaignTypes.NEW_CAMPAIGN_YEAR,
    payload: {
      year,
    },
  };
};

export const newCampaignUpdateWithTemplateValues = (
  withTemplateValues: boolean,
): NewCampaignWithTemplateValuesUpdatedAction => {
  return {
    type: CampaignTypes.NEW_CAMPAIGN_WITH_TEMPLATE_VALUES,
    payload: {
      withTemplateValues,
    },
  };
};

export const resetNewCampaignModal = (): NewCampaignModalResetAction => {
  return {
    type: CampaignTypes.NEW_CAMPAIGN_MODAL_RESET,
  };
};

export const create = ({
  perimeterId,
  year,
  type,
  campaignTemplateId,
  withTemplateValues,
  name,
}: {
  perimeterId: number,
  year: number,
  type: CampaignType,
  campaignTemplateId: number,
  withTemplateValues: boolean,
  name: string,
}, onCreated?: (campaignId: number) => void): CustomThunkAction => {
  return async (dispatch: Dispatch, getState) => {
    const nameFormatted = name === "" ? null : name
    const apiClient = ApiClient.buildFromBrowser();
    const response = await apiClient.post<CampaignResponse>(
      ApiRoutes.CAMPAIGNS,
      {
        perimeterId,
        year,
        type,
        campaignTemplateId,
        withTemplateValues,
        name: nameFormatted,
      }
    );
    if (onCreated) {
      onCreated(response.data.id);
    }
    const thunkDispatch: CustomThunkDispatch = dispatch;
    await thunkDispatch(getAllCampaignInformation(perimeterId));
  };
};

export const deleteCampaign = (
  perimeterId: number,
  campaignId: number,
  onRefreshed?: () => void
): CustomThunkAction => {
  return async (dispatch: Dispatch, getState) => {
    const apiClient = ApiClient.buildFromBrowser();
    await apiClient.delete<void>(
      generateRoute(ApiRoutes.CAMPAIGN, {
        id: campaignId,
      })
    );
    const thunkDispatch: CustomThunkDispatch = dispatch;
    await thunkDispatch(getAllCampaignInformation(perimeterId));
    if (onRefreshed) {
      onRefreshed();
    }
  };
};

export const duplicateCampaign = ({
  perimeterId,
  campaignId,
  withValues,
  onDuplicated,
}: {
  perimeterId: number,
  campaignId: number;
  withValues: boolean;
  onDuplicated?: (campaignId: number) => void;
}): CustomThunkAction => {
  return async (dispatch: Dispatch, getState) => {
    const apiClient = ApiClient.buildFromBrowser();
    const response = await apiClient.post<CampaignResponse>(generateRoute(ApiRoutes.CAMPAIGN_DUPLICATE, {
      id: campaignId,
    }), {
      id: campaignId,
      withValues,
    });
    if (onDuplicated) {
      onDuplicated(response.data.id);
    }
    const thunkDispatch: CustomThunkDispatch = dispatch;
    await thunkDispatch(getAllCampaignInformation(perimeterId));
  }
}

const apiUpdateCampaign = async (
  campaignInformation: {
    id: number,
    name: string,
    description: string | null,
    year: number | null,
    targetYear: number | null,
    status: CampaignStatus,
    type: CampaignType,
  }
): Promise<void> => {
  const apiClient = ApiClient.buildFromBrowser();
  await apiClient.put<CampaignResponse>(
    generateRoute(ApiRoutes.CAMPAIGN, {
      id: campaignInformation.id,
    }),
    {
      name: campaignInformation.name,
      description: campaignInformation.description,
      year: campaignInformation.year,
      targetYear: campaignInformation.targetYear,
      status: campaignInformation.status,
      type: campaignInformation.type,
    }
  );
};

export const updateCampaign = ({
  campaignId,
  name,
  description,
  year,
  targetYear,
  status,
  type,
}: {
  campaignId: number,
  name?: string,
  description?: string | null,
  year?: number,
  targetYear?: number | null,
  status?: CampaignStatus,
  type?: CampaignType,
}): CustomThunkAction => {
  return async (dispatch: Dispatch, getState) => {
    let campaignInformation = getState().campaign.campaigns[campaignId]?.information;
    if (!campaignInformation) {
      await getInformation({ campaignId });
      campaignInformation = getState().campaign.campaigns[campaignId]
        ?.information;
    }
    dispatch<UpdateCampaign>({
      type: CampaignTypes.UPDATE_CAMPAIGN,
      payload: {
        campaignId,
        name: name ?? campaignInformation!.name,
        description: description ?? campaignInformation!.description,
        targetYear: targetYear ?? campaignInformation!.targetYear,
        year: year ?? campaignInformation!.year,
        status: status ?? campaignInformation!.status,
        type: type ?? campaignInformation!.type,
      },
    });
    apiUpdateCampaign({
      id: campaignInformation!.id,
      name: name ?? campaignInformation!.name,
      description: description ?? campaignInformation!.description,
      targetYear: targetYear ?? campaignInformation!.targetYear,
      year: year ?? campaignInformation!.year,
      status: status ?? campaignInformation!.status,
      type: type ?? campaignInformation!.type,
    });
  };
};

export const setCurrentCampaign = ({
  campaignId,
}: {
  campaignId: number;
}): SetCurrentCampaign => ({
  type: CampaignTypes.SET_CURRENT_CAMPAIGN,
  payload: campaignId,
});

export const getAllCampaignInformation = (
  perimeterId: number,
  customApiClient?: ApiClient
): CustomThunkAction => {
  return async (dispatch: Dispatch) => {
    const apiClient = customApiClient ?? ApiClient.buildFromBrowser();
    const response = await apiClient.get<CampaignsResponse>(
      generateRoute(ApiRoutes.PERIMETERS_CAMPAIGNS, { id: perimeterId })
    );

    dispatch<SetAllInformationAction>({
      type: CampaignTypes.SET_ALL_INFORMATION,
      payload: response.data,
    });
  };
};

export const getInformation = ({
  campaignId,
  customApiClient,
}: {
  campaignId: number;
  customApiClient?: ApiClient;
}): CustomThunkAction => {
  return async (dispatch: Dispatch) => {
    const apiClient = customApiClient ?? ApiClient.buildFromBrowser();
    try {
      const response = await apiClient.get<CampaignResponse>(
        generateRoute(ApiRoutes.CAMPAIGN, {
          id: campaignId,
        })
      );

      dispatch<SetInformationAction>({
        type: CampaignTypes.SET_INFORMATION,
        payload: {
          campaignId,
          information: response.data,
        },
      });
    } catch (error: any) {
      dispatch<UnfoundCampaign>({
        type: CampaignTypes.UNFOUND_CAMPAIGN,
        payload: campaignId,
      });
    }
  };
};

export const getActivitiesForCampaigns = (
  campaignIds: number[],
  customApiClient?: ApiClient
): CustomThunkAction => {
  return async (dispatch: Dispatch) => {
    const apiClient = customApiClient ?? ApiClient.buildFromBrowser();
    const campaignsResponse = await apiClient.get<CampaignWithActivitiesResponse[]>(
      generateRoute(ApiRoutes.ACTIVITIES_FOR_MULTIPLE_CAMPAIGNS), true, {
        params: {
          campaignIds: campaignIds.join(','),
        }
      }
    );
    const activitiesWithCampaignId = campaignsResponse.data.map(
      (campaign) => ({
        activities: campaign.activities,
        campaignId: campaign.id,
      })
    );

    dispatch<SetActivitiesForMultipleCampaigns>({
      type: CampaignTypes.SET_ACTIVITIES_FOR_MULTIPLE_CAMPAIGNS,
      payload: activitiesWithCampaignId,
    });
  };
};

export function setTrajectories(
  campaignId: number,
  trajectoryIds: number[]
): SetTrajectories {
  return {
    type: CampaignTypes.SET_TRAJECTORIES,
    payload: {
      campaignId,
      trajectoryIds,
    },
  };
}

export function resetCampaignState(): ResetCampaignState {
  return {
    type: CampaignTypes.RESET_CAMPAIGN_STATE,
  };
}
