import { analyticEvents, CampaignEventType, EventType, GraphicEventType } from "@custom-types/core/AnalyticEvents";
import { CustomThunkAction } from "@custom-types/redux";
import ApiClient from "@lib/wecount-api/ApiClient";
import { Analytics } from "@lib/wecount-api/responses/apiResponses";
import { ApiRoutes, generateRoute } from "@lib/wecount-api/routes/apiRoutes";
import { Dispatch } from "redux";
import { AnalyticsTypes } from "./types";

export type AnalyticsAction =
    | SendHelpInfoAction
    | SendViewCampaignAction;

export interface SendHelpInfoAction {
    type: AnalyticsTypes.SEND_HELP_INFOS;
    payload: {
        campaignId: number;
        eventName: string;
    };
}

export function sendHelpInfo(
    payload: SendHelpInfoAction["payload"]
): SendHelpInfoAction {

    const apiClient = ApiClient.buildFromBrowser();

    apiClient.post<Analytics>(
        generateRoute(ApiRoutes.ANALYTICS), {
        eventName: payload.eventName,
        campaignId: payload.campaignId
    });

    return {
        type: AnalyticsTypes.SEND_HELP_INFOS,
        payload
    }
}
export interface SendViewCampaignAction {
    type: AnalyticsTypes.SEND_VIEW_CAMPAIGN;
    payload: {
        eventName: CampaignEventType;
        campaignId: number;
    };
}

export function sendViewCampaign(
    payload: SendViewCampaignAction["payload"]
): SendViewCampaignAction {
    const { eventName, campaignId } = payload;

    const apiClient = ApiClient.buildFromBrowser();

    apiClient.post<Analytics>(
        generateRoute(ApiRoutes.ANALYTICS),
        {
            eventName: analyticEvents[EventType.CAMPAIGN][eventName],
            campaignId: campaignId
        }
    );

    return {
        type: AnalyticsTypes.SEND_VIEW_CAMPAIGN,
        payload,
    };
}

export interface SendResultGraphicAction {
    type: AnalyticsTypes.SEND_RESULT_GRAPHIC;
    payload: {
        eventName: GraphicEventType;
        campaignId: number;
    };
}

export function sendResultGraphic(
    payload: SendResultGraphicAction["payload"]
): SendResultGraphicAction {
    const { eventName, campaignId } = payload;

    const apiClient = ApiClient.buildFromBrowser();

    apiClient.post<Analytics>(
        generateRoute(ApiRoutes.ANALYTICS),
        {
            eventName: analyticEvents[EventType.GRAPHICS][eventName],
            campaignId: campaignId
        }
    );

    return {
        type: AnalyticsTypes.SEND_RESULT_GRAPHIC,
        payload,
    };
}