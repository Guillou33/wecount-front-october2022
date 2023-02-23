import { CustomThunkAction } from "@custom-types/redux";

import ApiClient from "@lib/wecount-api/ApiClient";
import { ApiRoutes, generateRoute } from "@lib/wecount-api/routes/apiRoutes";

import { EntryTagTypes } from "./types";
import { EntryTagResponse } from "@lib/wecount-api/responses/apiResponses";

export type Action =
  | SetEntryTags
  | EntryTagsFetchRequested
  | SetEntryTagsAreFetching
  | EntryTagCreationRequested
  | SetEntryTagCreated
  | EntryTagCreationError
  | CreationErrorRemoved
  | UpdateRequested
  | ArchiveRequested
  | UnarchiveRequested
  | ResetEntryTagState;

export interface EntryTagsFetchRequested {
  type: EntryTagTypes.ENTRY_TAGS_FETCH_REQUESTED;
  payload: {
    perimeterId: number;
  };
}

interface SetEntryTagsAreFetching {
  type: EntryTagTypes.IS_FETCHING;
}

interface SetEntryTags {
  type: EntryTagTypes.SET_ENTRY_TAGS;
  payload: {
    entryTags: EntryTagResponse[];
  };
}

export interface EntryTagCreationRequested {
  type: EntryTagTypes.CREATE_REQUESTED;
  payload: {
    perimeterId: number;
    name: string;
  };
}

interface SetEntryTagCreated {
  type: EntryTagTypes.CREATED;
  payload: {
    entryTag: EntryTagResponse;
  };
}

interface EntryTagCreationError {
  type: EntryTagTypes.CREATION_ERROR;
}

interface CreationErrorRemoved {
  type: EntryTagTypes.CREATION_ERROR_REMOVED;
}

export interface UpdateRequested {
  type: EntryTagTypes.UPDATE_REQUESTED;
  payload: {
    entryTagId: number;
    newName: string;
  };
}

export interface ArchiveRequested {
  type: EntryTagTypes.ARCHIVE_REQUESTED;
  payload: {
    entryTagId: number;
  };
}

export interface UnarchiveRequested {
  type: EntryTagTypes.UNARCHIVE_REQUESTED;
  payload: {
    entryTagId: number;
  };
}

export interface ResetEntryTagState {
  type: EntryTagTypes.RESET_ENTRY_TAGS_STATE;
}

export function entryTagsFetchRequested({
  perimeterId,
}: {
  perimeterId: number;
}): CustomThunkAction {
  return async (dispatch, getState) => {
    const state = getState();
    if (state.core.entryTag.isFetching) return;

    dispatch(setEntryTagsAreFetching());

    const apiClient = ApiClient.buildFromBrowser();

    const response = await apiClient.get<EntryTagResponse[]>(
      generateRoute(ApiRoutes.PERIMETER_ENTRY_TAGS, { id: perimeterId })
    );
    dispatch(setEntryTags({ entryTags: response.data }));
  };
}

export function setEntryTags(payload: {
  entryTags: EntryTagResponse[];
}): SetEntryTags {
  return {
    type: EntryTagTypes.SET_ENTRY_TAGS,
    payload,
  };
}

export function setEntryTagsAreFetching(): SetEntryTagsAreFetching {
  return {
    type: EntryTagTypes.IS_FETCHING,
  };
}

export function requestCreation(payload: {
  name: string;
  perimeterId: number;
}): EntryTagCreationRequested {
  return {
    type: EntryTagTypes.CREATE_REQUESTED,
    payload,
  };
}

export function setEntryTagCreated(payload: {
  entryTag: EntryTagResponse;
}): SetEntryTagCreated {
  return {
    type: EntryTagTypes.CREATED,
    payload,
  };
}

export function setCreationError(): EntryTagCreationError {
  return {
    type: EntryTagTypes.CREATION_ERROR,
  };
}

export function removeCreationError(): CreationErrorRemoved {
  return {
    type: EntryTagTypes.CREATION_ERROR_REMOVED,
  };
}

export function requestUpdateEntryTag(
  payload: UpdateRequested["payload"]
): UpdateRequested {
  return {
    type: EntryTagTypes.UPDATE_REQUESTED,
    payload,
  };
}

export function requestArchive(
  payload: ArchiveRequested["payload"]
): ArchiveRequested {
  return {
    type: EntryTagTypes.ARCHIVE_REQUESTED,
    payload,
  };
}

export function requestUnarchive(
  payload: UnarchiveRequested["payload"]
): UnarchiveRequested {
  return {
    type: EntryTagTypes.UNARCHIVE_REQUESTED,
    payload,
  };
}

export function resetEntryTagState(): ResetEntryTagState {
  return {
    type: EntryTagTypes.RESET_ENTRY_TAGS_STATE,
  };
}
