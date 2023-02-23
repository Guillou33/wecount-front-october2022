import { IndicatorTypes } from "@actions/indicator/types";
import { Action } from "@actions/indicator/indicatorAction";
import { IndicatorResponse } from "@lib/wecount-api/responses/apiResponses";

export interface IndicatorState {
  [campaignId: number]: CampaignIndicators;
}

export type CampaignIndicators = {
  isCreating: boolean;
  fetched: boolean;
  indicators: IndicatorsById;
};

export type IndicatorsById = {
  [indicatorId: number]: IndicatorResponse;
};

const initialState: IndicatorState = {};

function reducer(
  state: IndicatorState = initialState,
  action: Action
): IndicatorState {
  switch (action.type) {
    case IndicatorTypes.SET_CAMPAIGN_INDICATORS: {
      const { campaignId, indicators } = action.payload;
      const indicatorsById = getIndicatorsMappedById(indicators);
      return {
        ...state,
        [campaignId]: {
          ...state[campaignId],
          indicators: indicatorsById,
          fetched: true,
          isCreating: false,
        },
      };
    }

    case IndicatorTypes.SET_INDICATOR: {
      const { campaignId, id } = action.payload.indicator;
      return {
        ...state,
        [campaignId]: {
          ...state[campaignId],
          isCreating: false,
          indicators: {
            ...state[campaignId].indicators,
            [id]: action.payload.indicator,
          },
        },
      };
    }

    case IndicatorTypes.REQUEST_CREATE_INDICATOR: {
      const { campaignId } = action.payload;
      return {
        ...state,
        [campaignId]: {
          ...state[campaignId],
          isCreating: true,
        },
      };
    }

    case IndicatorTypes.REQUEST_UPDATE_INDICATOR: {
      const { campaignId, id, name, unit, quantity } = action.payload;
      return {
        ...state,
        [campaignId]: {
          ...state[campaignId],
          indicators: {
            ...state[campaignId].indicators,
            [id]: {
              ...state[campaignId].indicators[id],
              name,
              quantity,
              unit,
            },
          },
        },
      };
    }

    case IndicatorTypes.REQUEST_DELETE_INDICATOR: {
      const { campaignId, indicatorId } = action.payload;

      const updatedIndicatorList = Object.values(
        state[campaignId].indicators
      ).filter(indicator => indicator.id !== indicatorId);

      return {
        ...state,
        [campaignId]: {
          ...state[campaignId],
          indicators: {
            ...getIndicatorsMappedById(updatedIndicatorList),
          },
        },
      };
    }
    default:
      return state;
  }
}

function getIndicatorsMappedById(
  indicators: IndicatorResponse[]
): IndicatorsById {
  return indicators.reduce((acc, indicator) => {
    acc[indicator.id] = indicator;
    return acc;
  }, {} as IndicatorsById);
}

export default reducer;
