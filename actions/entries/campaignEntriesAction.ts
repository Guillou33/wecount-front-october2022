import { ComputeMethodType } from "@custom-types/core/ComputeMethodType";
import { Status } from "@custom-types/core/Status";
import { CustomThunkAction } from "@custom-types/redux";
import ApiClient from "@lib/wecount-api/ApiClient";
import { EntriesResponse } from "@lib/wecount-api/responses/apiResponses";
import { ApiRoutes, generateRoute } from "@lib/wecount-api/routes/apiRoutes";
import { CardExpansionNames } from "@reducers/cardExpansion/cardExpansionReducer";
import {
  ActivityEntryReferenceHistory,
  EntryData,
  WritableEntryData
} from "@reducers/entries/campaignEntriesReducer";
import { Dispatch } from "redux";
import { CampaignEntriesTypes } from "./campaignEntriesTypes";

export type Action =
  | SetAllEntries
  | UpdateEntryRequested
  | UpdateEntry
  | DuplicateEntryRequested
  | SetEntriesAfterDuplicate
  | SetEntryComputeMethod
  | AddBlankEntry
  | DeleteEntryRequested
  | ApiRequestFailed
  | FetchHistoryRequested
  | HistoryFetched
  | EntrySubmissionRequested
  | ResetOwnerOnAllEntries
  | SetStatusForEntries
  | SetEntriesSelectedStatus
  | DeleteEntriesInListRequested
  | FetchAllEntriesOfCampaignsRequested
  | SetAllEntriesOfCampaigns
  | ResetCampaignEntries
  | KeepOnlyEntriesForCampaign
  | AddEntry;

export interface FetchAllEntriesRequested {
  type: CampaignEntriesTypes.FETCH_ALL_ENTRIES_REQUESTED;
  payload: {
    campaignId: number;
    customApiClient?: ApiClient;
  };
}
export function requestFetchAllEntries(
  campaignId: number,
  customApiClient?: ApiClient
): FetchAllEntriesRequested {
  return {
    type: CampaignEntriesTypes.FETCH_ALL_ENTRIES_REQUESTED,
    payload: {
      campaignId,
      customApiClient,
    },
  };
}

interface SetAllEntries {
  type: CampaignEntriesTypes.SET_ALL_ENTRIES;
  payload: {
    campaignId: number;
    entries: EntryData[];
  };
}
export function setAllEntries(
  payload: SetAllEntries["payload"]
): SetAllEntries {
  return {
    type: CampaignEntriesTypes.SET_ALL_ENTRIES,
    payload,
  };
}

export interface UpdateEntryRequested {
  type: CampaignEntriesTypes.UPDATE_ENTRY_REQUESTED;
  payload: {
    campaignId: number;
    entryKey: string;
    entryId: number | undefined;
    activityModelId: number;
    entryData: WritableEntryData;
  };
}
export function requestUpdateEntry(
  payload: UpdateEntryRequested["payload"]
): UpdateEntryRequested {
  return {
    type: CampaignEntriesTypes.UPDATE_ENTRY_REQUESTED,
    payload,
  };
}

interface UpdateEntry {
  type: CampaignEntriesTypes.UPDATE_ENTRY;
  payload: {
    campaignId: number;
    entryKey: string;
    entryData: WritableEntryData;
  };
}
export function updateEntry(payload: UpdateEntry["payload"]): UpdateEntry {
  return {
    type: CampaignEntriesTypes.UPDATE_ENTRY,
    payload,
  };
}

interface SetEntryComputeMethod {
  type: CampaignEntriesTypes.SET_ENTRY_COMPUTE_METHOD;
  payload: {
    campaignId: number;
    entryKey: string;
    computeMethodType: ComputeMethodType;
    computeMethodId: number | null;
  };
}
export function setEntryComputeMethod(
  payload: SetEntryComputeMethod["payload"]
): SetEntryComputeMethod {
  return {
    type: CampaignEntriesTypes.SET_ENTRY_COMPUTE_METHOD,
    payload,
  };
}

export interface FetchHistoryRequested {
  type: CampaignEntriesTypes.FETCH_HISTORY_REQUESTED;
  payload: {
    campaignId: number;
    activityEntryId: number;
    activityEntryKey: string;
  };
}

export const requestFetchHistory = ({
  campaignId,
  activityEntryId,
  activityEntryKey,
}: {
  campaignId: number;
  activityEntryId: number;
  activityEntryKey: string;
}): FetchHistoryRequested => {
  return {
    type: CampaignEntriesTypes.FETCH_HISTORY_REQUESTED,
    payload: {
      campaignId,
      activityEntryId,
      activityEntryKey,
    },
  };
};

interface HistoryFetched {
  type: CampaignEntriesTypes.HISTORY_FETCHED;
  payload: {
    campaignId: number;
    activityEntryId: number;
    activityEntryKey: string;
    activityEntryReferenceHistoryList: ActivityEntryReferenceHistory[];
  };
}

export const setHistoryFetched = ({
  campaignId,
  activityEntryId,
  activityEntryKey,
  activityEntryReferenceHistoryList,
}: {
  campaignId: number;
  activityEntryId: number;
  activityEntryKey: string;
  activityEntryReferenceHistoryList: ActivityEntryReferenceHistory[];
}): HistoryFetched => {
  return {
    type: CampaignEntriesTypes.HISTORY_FETCHED,
    payload: {
      campaignId,
      activityEntryId,
      activityEntryKey,
      activityEntryReferenceHistoryList,
    },
  };
};

interface AddBlankEntry {
  type: CampaignEntriesTypes.ADD_BLANK_ENTRY;
  payload: {
    campaignId: number;
    activityModelId: number;
    status: Status;
    siteId: number | null;
    productId: number | null;
    entryTagIds: number[];
  };
}
export function addBlankEntry(
  payload: AddBlankEntry["payload"]
): AddBlankEntry {
  return {
    type: CampaignEntriesTypes.ADD_BLANK_ENTRY,
    payload,
  };
}

export interface DeleteEntryRequested {
  type: CampaignEntriesTypes.DELETE_ENTRY_REQUESTED;
  payload: {
    campaignId: number;
    entryKey: string;
    entryId: number | undefined;
  };
}
export function requestDeleteEntry(
  payload: DeleteEntryRequested["payload"]
): DeleteEntryRequested {
  return {
    type: CampaignEntriesTypes.DELETE_ENTRY_REQUESTED,
    payload,
  };
}

interface ApiRequestFailed {
  type: CampaignEntriesTypes.API_REQUEST_FAILED;
  payload: {
    campaignId: number;
    entryKey: string;
  };
}
export function apiRequestFailed(
  payload: ApiRequestFailed["payload"]
): ApiRequestFailed {
  return {
    type: CampaignEntriesTypes.API_REQUEST_FAILED,
    payload,
  };
}

export interface DuplicateEntryRequested {
  type: CampaignEntriesTypes.DUPLICATE_ENTRY;
  payload: {
    cardExpansionName: CardExpansionNames;
    activityEntryId: number | null;
    computeMethodId: number | null;
    campaignId: number;
  };
}

export function duplicateEntry(
  payload: DuplicateEntryRequested["payload"]
): DuplicateEntryRequested {
  return {
    type: CampaignEntriesTypes.DUPLICATE_ENTRY,
    payload,
  };
}

interface SetEntriesAfterDuplicate {
  type: CampaignEntriesTypes.FETCH_ENTRIES_AFTER_DUPLICATE;
  payload: {
    campaignId: number;
    entries: EntryData[];
    cardExpansionName: CardExpansionNames;
  };
}

export const requestDuplicateEntry = ({
  activityEntryId,
  computeMethodId,
  campaignId,
}: {
  activityEntryId: number | null;
  computeMethodId: number | null;
  campaignId: number;
}): CustomThunkAction => {
  return async (dispatch: Dispatch, getState) => {
    const apiClient = ApiClient.buildFromBrowser();

    const response = await apiClient.post<EntriesResponse[]>(
      generateRoute(ApiRoutes.ACTIVITY_ENTRY_DUPLICATE, {
        campaignId: campaignId,
        activityEntryId: activityEntryId!,
      }),
      {
        computeMethodId: computeMethodId,
      }
    );

    dispatch<FetchAllEntriesRequested>({
      type: CampaignEntriesTypes.FETCH_ALL_ENTRIES_REQUESTED,
      payload: {
        campaignId,
      },
    });
  };
};

export interface EntrySubmissionRequested {
  type: CampaignEntriesTypes.ENTRY_SUBMISSION_REQUESTED;
  payload: {
    campaignId: number;
    entryKey: string;
    entryId: number;
  };
}
export function requestEntrySubmission(
  payload: EntrySubmissionRequested["payload"]
): EntrySubmissionRequested {
  return {
    type: CampaignEntriesTypes.ENTRY_SUBMISSION_REQUESTED,
    payload,
  };
}

export interface ResetOwnerOnAllEntries {
  type: CampaignEntriesTypes.RESET_OWNER_ON_ALL_ENTRIES;
  payload: {
    ownerId: number;
  };
}

export function resetOwnerOnAllEntries(
  payload: ResetOwnerOnAllEntries["payload"]
): ResetOwnerOnAllEntries {
  return {
    type: CampaignEntriesTypes.RESET_OWNER_ON_ALL_ENTRIES,
    payload,
  };
}
export interface SetStatusForEntries {
  type: CampaignEntriesTypes.SET_STATUS_FOR_ENTRIES;
  payload: {
    status: Status;
    list: Array<number | string | undefined>;
  };
}

export function setStatusForEntries(
  payload: SetStatusForEntries["payload"]
): SetStatusForEntries {
  return {
    type: CampaignEntriesTypes.SET_STATUS_FOR_ENTRIES,
    payload,
  };
}

export interface SetEntriesSelectedStatus {
  type: CampaignEntriesTypes.FETCH_ENTRIES_AFTER_SELECTION;
  payload: {
    campaignId: number;
    entries: EntryData[];
    cardExpansionName: CardExpansionNames;
  };
}

export function setEntriesSelectedStatus(
  payload: SetEntriesSelectedStatus["payload"]
): SetEntriesSelectedStatus {
  return {
    type: CampaignEntriesTypes.FETCH_ENTRIES_AFTER_SELECTION,
    payload,
  };
}

export interface FetchAllEntriesOfCampaignsRequested {
  type: CampaignEntriesTypes.FETCH_ALL_ENTRIES_OF_CAMPAIGNS_REQUESTED;
  payload: {
    campaignIds: number[];
  };
}

export function fetchAllEntriesOfCampaignsRequested(
  payload: FetchAllEntriesOfCampaignsRequested["payload"]
): FetchAllEntriesOfCampaignsRequested {
  return {
    type: CampaignEntriesTypes.FETCH_ALL_ENTRIES_OF_CAMPAIGNS_REQUESTED,
    payload,
  };
}

export interface DeleteEntriesInListRequested {
  type: CampaignEntriesTypes.DELETE_ENTRIES_IN_SELECTION;
  payload: {
    campaignId: number;
    list: Array<number | string>;
  };
}

export function requestDeleteEntriesInList(
  payload: DeleteEntriesInListRequested["payload"]
): DeleteEntriesInListRequested {
  return {
    type: CampaignEntriesTypes.DELETE_ENTRIES_IN_SELECTION,
    payload,
  };
}

export interface SetAllEntriesOfCampaigns {
  type: CampaignEntriesTypes.SET_ALL_ENTRIES_OF_CAMPAIGNS;
  payload: { campaignId: number; entries: EntryData[] }[];
}

export function setAllEntriesOfCampaigns(
  payload: SetAllEntriesOfCampaigns["payload"]
): SetAllEntriesOfCampaigns {
  return {
    type: CampaignEntriesTypes.SET_ALL_ENTRIES_OF_CAMPAIGNS,
    payload,
  };
}

export interface ResetCampaignEntries {
  type: CampaignEntriesTypes.RESET;
}

export function resetCampaignEntries(): ResetCampaignEntries {
  return {
    type: CampaignEntriesTypes.RESET,
  };
}

export interface KeepOnlyEntriesForCampaign {
  type: CampaignEntriesTypes.KEEP_ONLY_ENTRIES_FOR_CAMPAIGN;
  payload: {
    campaignId: number;
  }
}

export function keepOnlyEntriesForCampaign({
  campaignId,
}: {
  campaignId: number;
}): KeepOnlyEntriesForCampaign {
  return {
    type: CampaignEntriesTypes.KEEP_ONLY_ENTRIES_FOR_CAMPAIGN,
    payload: {
      campaignId,
    },
  };
}
export interface AddEntry {
  type: CampaignEntriesTypes.ADD_ENTRY;
  payload: {
    campaignId: number;
    entry: EntryData;
  }
}

export function addEntry({
  campaignId,
  entry
}: {
  campaignId: number;
  entry: EntryData;
}): AddEntry {
  return {
    type: CampaignEntriesTypes.ADD_ENTRY,
    payload: {
      campaignId,
      entry,
    },
  };
}
