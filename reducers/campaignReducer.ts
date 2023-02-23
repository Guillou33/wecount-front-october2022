import {
  CampaignTypes,
} from "@actions/campaign/types";
import { Action } from "@actions/campaign/campaignActions";
import { ActivitiesResponse, CampaignsResponse } from '@lib/wecount-api/responses/apiResponses'
import _ from 'lodash';
import { Status } from "@custom-types/core/Status";
import { CampaignStatus } from "@custom-types/core/CampaignStatus";
import { CampaignType } from "@custom-types/core/CampaignType";

export enum UnitModes {
  RAW = 'RAW',
  PERCENT = 'PERCENT',
}

export interface ActivityEntry {
  id: number;
  resultTco2: number;
  siteId: number | null;
  productId: number | null;
  status: Status;
  title: string | null;
  description: string | null;
  manualTco2: number | null;
  manualUnitNumber: number | null;
  dataSource: string | null;
  computeMethodType: string | null;
  uncertainty: number;
  value: number | null;
  value2: number | null;
  emissionFactor?: EmissionFactor,
}

export interface EmissionFactor {
  id: number,
  name: string,
  unit: string | null,
  uncertainty: number,
}

export interface Activity {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string | null;
  description: string | null;
  reductionIdea: string | null;
  reductionTarget: number | null;
  status: Status;
  resultTco2: number | null;
  uncertainty: number | null;
  activityModelId: number;
  ownerId: number | null;
  activityEntries?: ActivityEntry[];
};

export interface CampaignInformation {
  id: number;
  perimeterId: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string | null;
  resultTco2Upstream: number;
  resultTco2Core: number;
  resultTco2Downstream: number;
  uncertaintyUpstream: number;
  uncertaintyCore: number;
  uncertaintyDownstream: number;
  resultTco2UpstreamForTrajectory: number;
  resultTco2CoreForTrajectory: number;
  resultTco2DownstreamForTrajectory: number;
  uncertaintyUpstreamForTrajectory: number;
  uncertaintyCoreForTrajectory: number;
  uncertaintyDownstreamForTrajectory: number;
  year: number;
  targetYear: number | null;
  campaignTrajectoryIds: number[];
  status: CampaignStatus;
  type: CampaignType;
}

export interface Campaign {
  unfound?: boolean;
  information?: CampaignInformation;
  activitiesFetched: boolean;
  activityEntriesFetched: boolean;
  unitMode: UnitModes;
  activities?: {
    [key: number]: Activity;
  }
}

export interface NewCampaign {
  name: string | undefined;
  year: number | undefined;
  type: CampaignType | undefined;
  templateId: number | undefined;
  withTemplateValues: boolean;
}

export interface CampaignState {
  campaigns: {
    [key: number]: Campaign
  };
  currentCampaign: number | undefined;
  allCampaignInformationSet: boolean;
  newCampaign: NewCampaign;
};

export interface ActivitiesWithCampaignId {
  activities: ActivitiesResponse;
  campaignId: number;
}

/**
 * Initial reducer state
 * @type {Object}
 */
const INITIAL_STATE: CampaignState = {
  campaigns: {},
  currentCampaign: undefined,
  allCampaignInformationSet: false,
  newCampaign: {
    name: undefined,
    type: undefined,
    year: undefined,
    templateId: undefined,
    withTemplateValues: false,
  }
};

/**
 * Updates reducer state depending on action type
 * @param {Object} state - the reducer state
 * @param {Object} action - the fired action object
 * @param {string} action.type - the action type
 * @param {?Object} action.payload - additional action data
 * @return {Object} new reducer state
 */
const reducer = (state: CampaignState = INITIAL_STATE, action: Action): CampaignState => {
  switch (action.type) {
    case CampaignTypes.SET_INFORMATION:
      return {
        ...state,
        campaigns: {
          ...state.campaigns,
          [action.payload.campaignId]: {
            ...state.campaigns[action.payload.campaignId],
            information: action.payload.information
          }
        }
      }
    case CampaignTypes.SET_ALL_INFORMATION:
      return {
        ...state,
        campaigns: addInformationToAllCampaignsAndPurge(state.campaigns, action.payload),
        allCampaignInformationSet: true,
      }
    case CampaignTypes.SET_CURRENT_CAMPAIGN:
      return {
        ...state,
        currentCampaign: action.payload
      }
    case CampaignTypes.UNFOUND_CAMPAIGN:
      return {
        ...state,
        campaigns: {
          ...state.campaigns,
          [action.payload]: {
            ...state.campaigns[action.payload],
            unfound: true
          }
        }
      }
    case CampaignTypes.UPDATE_CAMPAIGN:
      if (!state.campaigns[action.payload.campaignId]?.information) {
        return state;
      }
      return {
        ...state,
        campaigns: {
          ...state.campaigns,
          [action.payload.campaignId]: {
            ...state.campaigns[action.payload.campaignId],
            information: {
              ...state.campaigns[action.payload.campaignId].information!,
              name: action.payload.name,
              description: action.payload.description,
              targetYear: action.payload.targetYear,
              year: action.payload.year,
              status: action.payload.status,
              type: action.payload.type,
            }
          }
        }
      }
    case CampaignTypes.CHANGE_CAMPAIGN_UNIT_MODE:
      if (!state.campaigns[action.payload.campaignId]) {
        return state;
      }
      return {
        ...state,
        campaigns: {
          ...state.campaigns,
          [action.payload.campaignId]: {
            ...state.campaigns[action.payload.campaignId],
            unitMode: action.payload.newUnitMode,
          }
        }
      }
    case CampaignTypes.SET_ACTIVITIES_FOR_MULTIPLE_CAMPAIGNS:
      return {
        ...state,
        campaigns: action.payload.reduce(setActivities, { ...state.campaigns }),
      };
    
    case CampaignTypes.SET_TRAJECTORIES:
      return {
        ...state,
        campaigns: {
          ...state.campaigns,
          [action.payload.campaignId]: {
            ...state.campaigns[action.payload.campaignId],
            information: {
              ...state.campaigns[action.payload.campaignId].information!,
              campaignTrajectoryIds: action.payload.trajectoryIds,
            }
          }
        }
      }
    case CampaignTypes.RESET_CAMPAIGN_STATE: {
      return INITIAL_STATE;
    }
    case CampaignTypes.NEW_CAMPAIGN_NAME: {
      return {
        ...state,
        newCampaign: {
          ...state.newCampaign,
          name: action.payload.name,
        }
      }
    }
    case CampaignTypes.NEW_CAMPAIGN_YEAR: {
      return {
        ...state,
        newCampaign: {
          ...state.newCampaign,
          year: action.payload.year,
        }
      }
    }
    case CampaignTypes.NEW_CAMPAIGN_TYPE: {
      return {
        ...state,
        newCampaign: {
          ...state.newCampaign,
          type: action.payload.type,
        }
      }
    }
    case CampaignTypes.NEW_CAMPAIGN_TEMPLATE: {
      return {
        ...state,
        newCampaign: {
          ...state.newCampaign,
          templateId: action.payload.templateId,
        }
      }
    }
    case CampaignTypes.NEW_CAMPAIGN_WITH_TEMPLATE_VALUES: {
      return {
        ...state,
        newCampaign: {
          ...state.newCampaign,
          withTemplateValues: action.payload.withTemplateValues,
        }
      }
    }
    case CampaignTypes.NEW_CAMPAIGN_MODAL_RESET: {
      return {
        ...state,
        newCampaign: {
          ...INITIAL_STATE.newCampaign,
        }
      }
    }
    
    default:
      return state;
  }
};

const formatActivitiesFromServer = (serverActivities: ActivitiesResponse): { [key: number]: Activity; } => {
  return serverActivities.reduce((activities: { [key: number]: Activity; }, activity) => {
    const newActivity: Activity = {
      ...activity,
      activityModelId: activity.activityModel.id,
      ownerId: activity.owner?.id ?? null,
    };
    const formattedActivity: Activity = _.omit(_.omit(newActivity, 'activityModel'), 'owner');
    activities[formattedActivity.id] = formattedActivity;

    return activities;
  }, {});
};

const addInformationToAllCampaignsAndPurge = (campaignState: { [key: number]: Campaign }, campaigns: CampaignsResponse): { [key: number]: Campaign } => {
  const newCampaignState = { ...campaignState };
  const campaignIds = campaigns.map((campaign) => campaign.id);
  for (const [campaignId, campaign] of Object.entries(newCampaignState)) {
    if (campaignIds.indexOf(parseInt(campaignId)) === -1) {
      delete newCampaignState[parseInt(campaignId)];
    }
  }
  campaigns.forEach((campaign) => {
    if (!newCampaignState[campaign.id]) {
      newCampaignState[campaign.id] = {
        activitiesFetched: false,
        activityEntriesFetched: false,
        unitMode: UnitModes.RAW,
      };
    }
    newCampaignState[campaign.id] = {
      ...newCampaignState[campaign.id],
      information: campaign,
    }
  });

  return newCampaignState;
}

const setActivities = (
  newCampaignState: { [key: number]: Campaign },
  { campaignId, activities }: ActivitiesWithCampaignId
) => {
  if (newCampaignState[campaignId] != null) {
    newCampaignState[campaignId] = {
      ...newCampaignState[campaignId],
      activitiesFetched: true,
      activities: formatActivitiesFromServer(activities),
    };
  }
  return newCampaignState;
};

export default reducer;
