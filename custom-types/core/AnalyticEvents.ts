import { FilterNames } from "@reducers/filters/filtersReducer";

export enum UserEventType {
    LOGGED_IN = "LOGGED_IN",
}

export enum CampaignEventType {
    VIEW = "VIEW",
}

export enum HelpEventType {
    NAVBAR = "NAVBAR",
    ENTRY = "ENTRY",
    ACTION_PLAN = "ACTION_PLAN"
}

export enum EntryEventType {
    CREATED = "CREATED",
    OWNER = "OWNER",
    WRITER = "WRITER",
    INSTRUCTION = "INSTRUCTION",
    DESCRIPTION = "DESCRIPTION",
    DATA_SOURCE = "DATA_SOURCE"
}

export enum GraphicEventType {
    PUSH_VIEW = "PUSH_VIEW",
    PUSH_VIEW_ACTIVITY_MODEL = "PUSH_VIEW_ACTIVITY_MODEL",
    PUSH_VIEW_TOP_RESULT = "PUSH_VIEW_TOP_RESULT"
}

export enum EventType {
    HELP = "HELP",
    ENTRY = "ENTRY",
    FILTERS = "FILTERS",
    CAMPAIGN = "CAMPAIGN",
    GRAPHICS = "GRAPHICS",
    USER = "USER"
};

export const analyticEvents = {
    [EventType.USER]: {
        [UserEventType.LOGGED_IN]: "user_logged",
    },
    [EventType.CAMPAIGN]: {
        [CampaignEventType.VIEW]: "view_campaign",
    },
    [EventType.HELP]: {
        [HelpEventType.NAVBAR]: "help_navbar",
        [HelpEventType.ENTRY]: "help_entry",
        [HelpEventType.ACTION_PLAN]: "help_action_plan"
    },
    [EventType.ENTRY]: {
        // Not used in front
        [EntryEventType.CREATED]: "entry_created",
        [EntryEventType.OWNER]: "entry_owner",
        [EntryEventType.WRITER]: "entry_writer",
        [EntryEventType.INSTRUCTION]: "entry_instruction",
        [EntryEventType.DESCRIPTION]: "entry_description",
        [EntryEventType.DATA_SOURCE]: "entry_data_source"
    },
    [EventType.FILTERS]: {
        [FilterNames.CARTOGRAPHY_EXCLUDED]: "filter_excluded",
        [FilterNames.CARTOGRAPHY_SITES]: "filter_sites",
        [FilterNames.CARTOGRAPHY_PRODUCTS]: "filter_products",
        [FilterNames.CARTOGRAPHY_STATUSES]: "filter_statuses",
        [FilterNames.CARTOGRAPHY_EMISSION_FACTORS]: "filter_emission_factors",
        [FilterNames.CARTOGRAPHY_USER_DATA]: "filter_user_data",
        [FilterNames.CARTOGRAPHY_OWNER]: "filter_owner",
        [FilterNames.CARTOGRAPHY_WRITER]: "filter_writer",
        [FilterNames.CARTOGRAPHY_ENTRY_TAGS]: "filter_entry_tags",
        [FilterNames.LISTING_VIEW_ACTIVITY_MODELS]: "filter_listing_view_activity_models",
        [FilterNames.LISTING_VIEW_CATEGORIES]: "filter_listing_view_category",
    },
    [EventType.GRAPHICS]: {
        [GraphicEventType.PUSH_VIEW]: "on_click_graphic",
        [GraphicEventType.PUSH_VIEW_ACTIVITY_MODEL]: "on_click_graphic_activity_model",
        [GraphicEventType.PUSH_VIEW_TOP_RESULT]: "on_click_graphic_top_result"
    }
}