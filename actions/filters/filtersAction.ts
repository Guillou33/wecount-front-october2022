import {
  IdHashMapFilterName,
  StatusHashMapFilterName,
  SearchableFilterName,
  UserDataFilterName,
  ExcludedFilterName,
} from "@reducers/filters/filtersReducer";
import { FiltersActionType } from "./types";

import { Status } from "@custom-types/core/Status";

export type FilterAction =
  | ToggleExcludedPresence
  | ToggleIdPresence
  | ToggleMultipleIdPresence
  | ToggleStatusPresence
  | SetSearchTerm
  | ToggleSearchableFilterPresence
  | ToggleMultipleSearchableFilterPresence
  | SetUserDataFilter
  | ResetAllFilters;

export interface ToggleExcludedPresence {
  type: FiltersActionType.TOGGLE_EXCLUDED_PRESENCE;
  payload: {
    filterName: ExcludedFilterName;
    excludedEntries: number;
  };
}

export function toggleExcludedPresence(
  payload: ToggleExcludedPresence["payload"]
): ToggleExcludedPresence {
  return {
    type: FiltersActionType.TOGGLE_EXCLUDED_PRESENCE,
    payload,
  };
}

export interface ToggleIdPresence {
  type: FiltersActionType.TOGGLE_ID_PRESENCE;
  payload: {
    filterName: IdHashMapFilterName;
    elementId: number;
  };
}

export function toggleIdPresence(
  payload: ToggleIdPresence["payload"]
): ToggleIdPresence {
  return {
    type: FiltersActionType.TOGGLE_ID_PRESENCE,
    payload,
  };
}

export interface ToggleMultipleIdPresence {
  type: FiltersActionType.TOGGLE_MULTIPLE_ID_PRESENCE;
  payload: {
    filterName: IdHashMapFilterName;
    elements: number[];
  };
}

export function toggleMultipleIdPresence(
  payload: ToggleMultipleIdPresence["payload"]
): ToggleMultipleIdPresence {
  return {
    type: FiltersActionType.TOGGLE_MULTIPLE_ID_PRESENCE,
    payload,
  };
}

export interface ToggleStatusPresence {
  type: FiltersActionType.TOGGLE_STATUS_PRESENCE;
  payload: {
    filterName: StatusHashMapFilterName;
    status: Status;
  };
}

export function toggleStatusPresence(
  payload: ToggleStatusPresence["payload"]
): ToggleStatusPresence {
  return {
    type: FiltersActionType.TOGGLE_STATUS_PRESENCE,
    payload,
  };
}

export interface SetSearchTerm {
  type: FiltersActionType.SET_SEARCH_TERM;
  payload: {
    filterName: SearchableFilterName;
    value: string;
  };
}

export function setSearchTerm(
  payload: SetSearchTerm["payload"]
): SetSearchTerm {
  return {
    type: FiltersActionType.SET_SEARCH_TERM,
    payload,
  };
}

export interface ToggleSearchableFilterPresence {
  type: FiltersActionType.TOGGLE_SEARCHABLE_FILTER_PRESENCE;
  payload: {
    filterName: SearchableFilterName;
    elementId: number;
  };
}

export function toggleSearchableFilterPresence(
  payload: ToggleSearchableFilterPresence["payload"]
): ToggleSearchableFilterPresence {
  return {
    type: FiltersActionType.TOGGLE_SEARCHABLE_FILTER_PRESENCE,
    payload,
  };
}

export interface ToggleMultipleSearchableFilterPresence {
  type: FiltersActionType.TOGGLE_MULTIPLE_SEARCHABLE_FILTER_PRESENCE;
  payload: {
    filterName: SearchableFilterName;
    elementIds: number[];
  };
}

export function toggleMultipleSearchableFilterPresence(
  payload: ToggleMultipleSearchableFilterPresence["payload"]
): ToggleMultipleSearchableFilterPresence {
  return {
    type: FiltersActionType.TOGGLE_MULTIPLE_SEARCHABLE_FILTER_PRESENCE,
    payload,
  };
}


interface ResetAllFilters {
  type: FiltersActionType.RESET_ALL_FILTERS;
}

export function resetAllFilters(): ResetAllFilters {
  return {
    type: FiltersActionType.RESET_ALL_FILTERS,
  };
}

export interface SetUserDataFilter {
  type: FiltersActionType.SET_USER_DATA_FILTER;
  payload: {
    filterName: UserDataFilterName;
    userId: number | null;
  };
}
export function setUserdataFilter(
  payload: SetUserDataFilter["payload"]
): SetUserDataFilter {
  return {
    type: FiltersActionType.SET_USER_DATA_FILTER,
    payload,
  };
}
