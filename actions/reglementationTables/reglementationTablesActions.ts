import { ReglementationTablesTypes } from "./types";
import { Repartition } from "@reducers/reglementationTables/reglementationTableReducer";
import {
  TableType,
  ReglemetationResultsResponse,
} from "@lib/wecount-api/responses/apiResponses";
import { ReglementationTable } from "@lib/wecount-api/responses/apiResponses";

export type Action =
  | ReglementationTablesFetchRequested
  | SetReglementationTable
  | ReglementationTablesFetchFailed
  | ReglementationTableCampaignDataFetchRequested<"BEGES">
  | ReglementationTableCampaignDataFetchRequested<"ISO">
  | ReglementationTableCampaignDataFetchRequested<"GHG">
  | ReglementationTableCampaignDataFetched<"BEGES">
  | ReglementationTableCampaignDataFetched<"ISO">
  | ReglementationTableCampaignDataFetched<"GHG">
  | ReglementationTableCampaignDataFetchFailed
  | ReglementationTableResetCampaignData;

export interface ReglementationTablesFetchRequested {
  type: ReglementationTablesTypes.REGLEMENTATION_TABLES_FETCH_REQUESTED;
}
export function reglementationTablesFetchRequested(): ReglementationTablesFetchRequested {
  return {
    type: ReglementationTablesTypes.REGLEMENTATION_TABLES_FETCH_REQUESTED,
  };
}

interface SetReglementationTable {
  type: ReglementationTablesTypes.SET_REGLEMENTATION_TABLES;
  payload: {
    structure: Record<string, ReglementationTable>;
  };
}
export function setReglementationTable(
  payload: SetReglementationTable["payload"]
): SetReglementationTable {
  return { type: ReglementationTablesTypes.SET_REGLEMENTATION_TABLES, payload };
}

export interface ReglementationTablesFetchFailed {
  type: ReglementationTablesTypes.REGLEMENTATION_TABLES_FETCH_FAILED;
}

export function reglementationTablesFetchFailed(): ReglementationTablesFetchFailed {
  return {
    type: ReglementationTablesTypes.REGLEMENTATION_TABLES_FETCH_FAILED,
  };
}

export interface ReglementationTableCampaignDataFetchRequested<
  T extends TableType
> {
  type: ReglementationTablesTypes.REGLEMENTATION_TABLES_CAMPAIGN_DATA_FETCH_REQUESTED;
  payload: {
    tableType: T;
    campaignId: number;
  };
}

export function reglementationTableCampaignDataFetchRequested<
  T extends TableType
>(
  payload: ReglementationTableCampaignDataFetchRequested<T>["payload"]
): ReglementationTableCampaignDataFetchRequested<T> {
  return {
    type: ReglementationTablesTypes.REGLEMENTATION_TABLES_CAMPAIGN_DATA_FETCH_REQUESTED,
    payload,
  };
}

export interface ReglementationTableCampaignDataFetched<T extends TableType> {
  type: ReglementationTablesTypes.REGLEMENTATION_TABLES_CAMPAIGN_DATA_FETCHED;
  payload: {
    tableType: T;
    campaignId: number;
    data: ReglemetationResultsResponse<T>["activityEntryResults"];
  };
}

export function reglementationTableCampaignDataFetched<T extends TableType>(
  payload: ReglementationTableCampaignDataFetched<T>["payload"]
): ReglementationTableCampaignDataFetched<T> {
  return {
    type: ReglementationTablesTypes.REGLEMENTATION_TABLES_CAMPAIGN_DATA_FETCHED,
    payload,
  };
}

export interface ReglementationTableResetCampaignData {
  type: ReglementationTablesTypes.REGLEMENTATION_TABLES_RESET_CAMPAIGN_DATA;
}

export function resetAllCampaignData(): ReglementationTableResetCampaignData {
  return {
    type: ReglementationTablesTypes.REGLEMENTATION_TABLES_RESET_CAMPAIGN_DATA,
  };
}

export interface ReglementationTableCampaignDataFetchFailed {
  type: ReglementationTablesTypes.REGLEMENTATION_TABLES_CAMPAIGN_DATA_FETCH_FAILED;
  payload: {
    campaignId: number;
    tableType: TableType;
  };
}

export function reglementationTableCampaignDataFetchFailed(
  payload: ReglementationTableCampaignDataFetchFailed["payload"]
): ReglementationTableCampaignDataFetchFailed {
  return {
    type: ReglementationTablesTypes.REGLEMENTATION_TABLES_CAMPAIGN_DATA_FETCH_FAILED,
    payload,
  };
}
