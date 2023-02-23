import { DataImportTypes } from "./types";

import { EntryData } from "@reducers/dataImport/entryDataReducer";

import {
  MappableDataNames,
  NumberDataNames,
  StringDataNames,
} from "@lib/core/dataImport/mappableData";

import { DataImportErrors } from "@reducers/dataImport/entryDataReducer";
import { ComputeMethod } from "@lib/core/dataImport/computeMethod";
import { SavableData } from "@lib/core/dataImport/getSavableDataList";

export type Action =
  | SetEntryDataList
  | SetParsing
  | SetMappableData
  | SetNumberData
  | SetStringData
  | TagClicked
  | SetComputeMethod
  | SetEmissionFactor
  | SaveDataRequested
  | DataSaved
  | DataSavingFailed
  | ErrorAcknoledged
  | DeleteEntryData
  | SetMultiEntryTags
  | SetMultiEntryInputUnits
  | Reset;

export interface SetEntryDataList {
  type: DataImportTypes.SET_ENTRY_DATA_LIST;
  payload: {
    entryDataList: EntryData[];
  };
}

interface SetParsing {
  type: DataImportTypes.SET_PARSING;
  payload: {
    isParsing: boolean;
  };
}

interface SetMappableData {
  type: DataImportTypes.SET_MAPPABLE_DATA;
  payload: {
    dataName: MappableDataNames;
    entryDataIds: string[];
    id: number | null;
    entityName: string;
  };
}

interface SetNumberData {
  type: DataImportTypes.SET_NUMBER_DATA;
  payload: {
    dataName: NumberDataNames;
    entryDataId: string;
    value: number | null;
  };
}

interface SetStringData {
  type: DataImportTypes.SET_STRING_DATA;
  payload: {
    dataName: StringDataNames;
    entryDataId: string;
    value: string | null;
  };
}

interface TagClicked {
  type: DataImportTypes.TAG_CLICKED;
  payload: {
    entryDataId: string;
    tagId: number;
    tagName: string;
  };
}

interface SetComputeMethod {
  type: DataImportTypes.SET_COMPUTE_METHOD;
  payload: {
    entryDataIds: string[];
    computeMethod: ComputeMethod;
  };
}

interface SetEmissionFactor {
  type: DataImportTypes.SET_EMISSION_FACTOR;
  payload: {
    entryDataIds: string[];
    emissionFactor: {
      id: number;
      name: string;
    } | null;
  };
}

export interface SaveDataRequested {
  type: DataImportTypes.SAVE_DATA_REQUESTED;
  payload: {
    campaignId: number;
    data: SavableData[];
  };
}

export interface DataSaved {
  type: DataImportTypes.DATA_SAVED;
  payload: {
    campaignId: number;
  };
}

export interface DataSavingFailed {
  type: DataImportTypes.DATA_SAVING_FAILED;
  payload: {
    error: DataImportErrors;
  };
}

export interface ErrorAcknoledged {
  type: DataImportTypes.ERROR_ACKNOLEDGED;
}

export interface Reset {
  type: DataImportTypes.RESET;
}

export interface DeleteEntryData {
  type: DataImportTypes.DELETE_ENTRY_DATA;
  payload: {
    entryDataIds: string[];
  };
}

export interface SetMultiEntryTags {
  type: DataImportTypes.SET_MULTI_ENTRY_TAGS;
  payload: {
    entryDataIds: string[];
    tagIds: number[];
  };
}

export interface SetMultiEntryInputUnits {
  type: DataImportTypes.SET_MULTI_ENTRY_INPUT_UNITS;
  payload: {
    entryDataIds: string[];
    input1Unit?: string;
    input2Unit?: string;
  };
}

export function setEntryDataList(
  payload: SetEntryDataList["payload"]
): SetEntryDataList {
  return {
    type: DataImportTypes.SET_ENTRY_DATA_LIST,
    payload,
  };
}

export function setParsing(payload: SetParsing["payload"]): SetParsing {
  return {
    type: DataImportTypes.SET_PARSING,
    payload,
  };
}

export function setMappableData(
  payload: SetMappableData["payload"]
): SetMappableData {
  return {
    type: DataImportTypes.SET_MAPPABLE_DATA,
    payload,
  };
}

export function setNumberData(
  payload: SetNumberData["payload"]
): SetNumberData {
  return {
    type: DataImportTypes.SET_NUMBER_DATA,
    payload,
  };
}

export function setStringData(
  payload: SetStringData["payload"]
): SetStringData {
  return {
    type: DataImportTypes.SET_STRING_DATA,
    payload,
  };
}

export function tagClicked(payload: TagClicked["payload"]): TagClicked {
  return {
    type: DataImportTypes.TAG_CLICKED,
    payload,
  };
}

export function setComputeMethod(
  payload: SetComputeMethod["payload"]
): SetComputeMethod {
  return {
    type: DataImportTypes.SET_COMPUTE_METHOD,
    payload,
  };
}

export function setEmissionFactor(
  payload: SetEmissionFactor["payload"]
): SetEmissionFactor {
  return {
    type: DataImportTypes.SET_EMISSION_FACTOR,
    payload,
  };
}

export function saveDataRequested(
  payload: SaveDataRequested["payload"]
): SaveDataRequested {
  return {
    type: DataImportTypes.SAVE_DATA_REQUESTED,
    payload,
  };
}

export function dataSaved(payload: DataSaved["payload"]): DataSaved {
  return {
    type: DataImportTypes.DATA_SAVED,
    payload,
  };
}

export function dataSavingFailed(
  payload: DataSavingFailed["payload"]
): DataSavingFailed {
  return {
    type: DataImportTypes.DATA_SAVING_FAILED,
    payload,
  };
}

export function errorAcknoledged(): ErrorAcknoledged {
  return {
    type: DataImportTypes.ERROR_ACKNOLEDGED,
  };
}

export function reset(): Reset {
  return {
    type: DataImportTypes.RESET,
  };
}

export function deleteEntryData(
  payload: DeleteEntryData["payload"]
): DeleteEntryData {
  return {
    type: DataImportTypes.DELETE_ENTRY_DATA,
    payload,
  };
}

export function setMultiEntryTags(
  payload: SetMultiEntryTags["payload"]
): SetMultiEntryTags {
  return {
    type: DataImportTypes.SET_MULTI_ENTRY_TAGS,
    payload,
  };
}

export function setMultiEntryInputUnits(
  payload: SetMultiEntryInputUnits["payload"]
): SetMultiEntryInputUnits {
  return {
    type: DataImportTypes.SET_MULTI_ENTRY_INPUT_UNITS,
    payload,
  };
}
