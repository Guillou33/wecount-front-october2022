import { CustomEmissionFactorTypes } from "@actions/core/customEmissionFactor/types";
import { CustomEmissionFactorResponse } from "@lib/wecount-api/responses/apiResponses";

export type Action =
  | StateResetAction
  | RequestFetchAction
  | FetchedAction
  | RequestCreationAction
  | CreatedAction
  | RequestUpdateAction
  | ArchiveRequestedAction
  | UnarchiveRequestedAction
  | CreationEndAction
  | CreationError
;

interface StateResetAction {
  type: CustomEmissionFactorTypes.RESET_STATE;
}

interface RequestFetchAction {
  type: CustomEmissionFactorTypes.REQUEST_FETCH_CUSTOM_EMISSION_FACTOR;
}

interface FetchedAction {
  type: CustomEmissionFactorTypes.FETCHED_CUSTOM_EMISSION_FACTOR;
  payload: {
    customEmissionFactors: CustomEmissionFactorResponse[];
  };
}
interface CreationEndAction {
  type: CustomEmissionFactorTypes.END_CREATION;
}

export interface RequestCreationAction {
  type: CustomEmissionFactorTypes.REQUEST_CREATION_CUSTOM_EMISSION_FACTOR;
  payload: {
    perimeterId: number;
    value: number;
    name: string;
    input1Name: string;
    input1Unit: string;
    source?: string;
    comment?: string;
  }
}
export interface RequestUpdateAction {
  type: CustomEmissionFactorTypes.REQUEST_UPDATE_CUSTOM_EMISSION_FACTOR;
  payload: {
    cefId: number;
    value: number;
    name: string;
    input1Name: string;
    input1Unit: string;
    source?: string;
    comment?: string;
  }
}

interface CreatedAction {
  type: CustomEmissionFactorTypes.CUSTOM_EMISSION_FACTOR_CREATED;
}
export interface ArchiveRequestedAction {
  type: CustomEmissionFactorTypes.ARCHIVE_REQUESTED;
  payload: {
    cefId: number;
  };
}

export interface UnarchiveRequestedAction {
  type: CustomEmissionFactorTypes.UNARCHIVE_REQUESTED;
  payload: {
    cefId: number;
  };
}

export type CreationError = {
  type: CustomEmissionFactorTypes.CREATION_ERROR;
}

export const resetCustomEmissionFactorState = (): StateResetAction  => {
  return {
    type: CustomEmissionFactorTypes.RESET_STATE,
  };
}

export const requestFetchCustomEmissionFactors = (): RequestFetchAction => {
  return {
    type: CustomEmissionFactorTypes.REQUEST_FETCH_CUSTOM_EMISSION_FACTOR,
  };
}

export const setCustomEmissionFactorFetched = (customEmissionFactors: CustomEmissionFactorResponse[]): FetchedAction => {
  return {
    type: CustomEmissionFactorTypes.FETCHED_CUSTOM_EMISSION_FACTOR,
    payload: {
      customEmissionFactors,
    },
  };
}

export const requestCEFCreation = ({
  perimeterId,
  value,
  name,
  input1Name,
  input1Unit,
  source,
  comment,
}: {
  perimeterId: number;
  value: number;
  name: string;
  input1Name: string;
  input1Unit: string;
  source?: string;
  comment?: string;
}): RequestCreationAction => {
  return {
    type: CustomEmissionFactorTypes.REQUEST_CREATION_CUSTOM_EMISSION_FACTOR,
    payload: {
      perimeterId,
      value,
      name,
      input1Name,
      input1Unit,
      source,
      comment,
    }
  }
}

export const setCreationEnd = (): CreationEndAction  => {
  return {
    type: CustomEmissionFactorTypes.END_CREATION,
  };
}

export const requestCEFUpdate = ({
  cefId,
  value,
  name,
  input1Name,
  input1Unit,
  source,
  comment,
}: {
  cefId: number;
  value: number;
  name: string;
  input1Name: string;
  input1Unit: string;
  source?: string;
  comment?: string;
}): RequestUpdateAction => {
  return {
    type: CustomEmissionFactorTypes.REQUEST_UPDATE_CUSTOM_EMISSION_FACTOR,
    payload: {
      cefId,
      value,
      name,
      input1Name,
      input1Unit,
      source,
      comment,
    }
  }
}

export const requestArchive = (cefId: number): ArchiveRequestedAction => ({
  type: CustomEmissionFactorTypes.ARCHIVE_REQUESTED,
  payload: {
    cefId,
  },
});

export const requestUnarchive = (cefId: number): UnarchiveRequestedAction => ({
  type: CustomEmissionFactorTypes.UNARCHIVE_REQUESTED,
  payload: {
    cefId,
  },
});

export const setCreationError = (): CreationError => ({
  type: CustomEmissionFactorTypes.CREATION_ERROR,
});
