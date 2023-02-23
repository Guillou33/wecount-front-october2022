import { IndicatorTypes } from "@actions/indicator/types";
import { IndicatorResponse } from "@lib/wecount-api/responses/apiResponses";

type IndicatorUpdateData = {
  id: number;
  campaignId: number;
  name: string;
  unit: string | null;
  quantity: number | null;
};

export type Action =
  | SetIndicator
  | SetCampaignIndicators
  | RequestFetchCampaignIndicators
  | RequestCreateDefaultIndicators
  | RequestCreateIndicator
  | RequestUpdateIndicator
  | RequestDeleteIndicator;

export interface RequestFetchCampaignIndicators {
  type: IndicatorTypes.REQUEST_FETCH_CAMPAIGN_INDICATORS;
  payload: {
    campaignId: number;
  };
}

export type RequestCreateDefaultIndicators = {
  type: IndicatorTypes.REQUEST_CREATE_DEFAULT_INDICATORS;
  payload: {
    campaignId: number;
  };
};

export type RequestCreateIndicator = {
  type: IndicatorTypes.REQUEST_CREATE_INDICATOR;
  payload: {
    campaignId: number;
    name: string;
    unit: string | null;
    quantity: number | null;
  };
};

export type RequestUpdateIndicator = {
  type: IndicatorTypes.REQUEST_UPDATE_INDICATOR;
  payload: IndicatorUpdateData;
};

export type RequestDeleteIndicator = {
  type: IndicatorTypes.REQUEST_DELETE_INDICATOR;
  payload: {
    indicatorId: number;
    campaignId: number;
  };
};

interface SetIndicator {
  type: IndicatorTypes.SET_INDICATOR;
  payload: { indicator: IndicatorResponse };
}

interface SetCampaignIndicators {
  type: IndicatorTypes.SET_CAMPAIGN_INDICATORS;
  payload: {
    campaignId: number;
    indicators: IndicatorResponse[];
  };
}

export function requestFetchCampaignIndicators(
  campaignId: number
): RequestFetchCampaignIndicators {
  return {
    type: IndicatorTypes.REQUEST_FETCH_CAMPAIGN_INDICATORS,
    payload: { campaignId },
  };
}

export function requestCreateDefaultIndicators(
  campaignId: number
): RequestCreateDefaultIndicators {
  return {
    type: IndicatorTypes.REQUEST_CREATE_DEFAULT_INDICATORS,
    payload: { campaignId },
  };
}

export function requestUpdateIndicator(
  data: IndicatorUpdateData
): RequestUpdateIndicator {
  return {
    type: IndicatorTypes.REQUEST_UPDATE_INDICATOR,
    payload: data,
  };
}

export function setIndicator(indicator: IndicatorResponse): SetIndicator {
  return {
    type: IndicatorTypes.SET_INDICATOR,
    payload: { indicator },
  };
}

export function setCampaignIndicators(
  campaignId: number,
  indicators: IndicatorResponse[]
): SetCampaignIndicators {
  return {
    type: IndicatorTypes.SET_CAMPAIGN_INDICATORS,
    payload: {
      campaignId,
      indicators,
    },
  };
}

export function requestCreateIndicator(
  campaignId: number,
  name: string,
  unit: string | null,
  quantity: number | null
): RequestCreateIndicator {
  return {
    type: IndicatorTypes.REQUEST_CREATE_INDICATOR,
    payload: {
      campaignId,
      name,
      unit,
      quantity,
    },
  };
}

export function requestDeleteIndicator(
  campaignId: number,
  indicatorId: number
): RequestDeleteIndicator {
  return {
    type: IndicatorTypes.REQUEST_DELETE_INDICATOR,
    payload: {
      campaignId,
      indicatorId,
    },
  };
}
