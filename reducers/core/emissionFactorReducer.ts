import {
  EmissionFactorTypes,
} from "@actions/core/emissionFactor/types";
import { ComputeMethodResponse, EmissionFactorMappingResponse, EmissionFactorResponse, RootTagLabel } from '@lib/wecount-api/responses/apiResponses';
import { Action } from "@actions/core/emissionFactor/emissionFactorActions";
import immer from "immer";
import { SearchType } from "@custom-types/wecount-api/searchTypes";
import { ComputeMode } from "@custom-types/wecount-api/computeMethod";

export type EmissionFactor = EmissionFactorResponse;
export type EmissionFactorMapping = EmissionFactorMappingResponse;

export interface ComputeMethod {
  id: number;
  name: string;
  description: string | null;
  position: number;
  isDefault: boolean;
  valueName: string;
  value2Name: string | null;
  specialComputeMode: ComputeMode | null;
  emissionFactorSearchType: SearchType;
  emissionFactorMappings: EmissionFactorMappingResponse[] | undefined;
  emissionFactorLabel: string | null;
  relatedEFAreEditableEvenIfHasHistory: boolean;
  archivedDate: string | null;
  rootTagLabels: RootTagLabel[];
}

export interface ComputeMethodMapping {
  [computeMethodId: number]: ComputeMethod
}

export interface EmissionFactorState {
  mapping: {
    // Mapping with activityModel Id
    [activityModelId: number]: ComputeMethodMapping;
  },
}

/**
 * Initial reducer state
 * @type {Object}
 */
const INITIAL_STATE: EmissionFactorState = {
  mapping: {},
};

/**
 * Updates reducer state depending on action type
 * @param {Object} state - the reducer state
 * @param {Object} action - the fired action object
 * @param {string} action.type - the action type
 * @param {?Object} action.payload - additional action data
 * @return {Object} new reducer state
 */

const reducer = (state: EmissionFactorState = INITIAL_STATE, action: Action): EmissionFactorState => {
  switch (action.type) {
    case EmissionFactorTypes.FETCHED_COMPUTE_METHODS:
      return immer(state, draftState => { 
        draftState.mapping[action.payload.activityModelId] = formatComputeMethods(action.payload.computeMethods);
      });
    case EmissionFactorTypes.AUTOCOMPLETE_FILLED:
      return immer(state, draftState => { 
        draftState.mapping[action.payload.activityModelId][action.payload.computeMethodId].emissionFactorMappings = sortEmissionFactorMappings(action.payload.emissionFactorMappings);
      });
    default:
      return state;
  }
};

const formatComputeMethods = (computeMethods: ComputeMethodResponse[]) => {
  
  const computeMethodsFormatted = computeMethods.map((cm) => {
    const cmFormatted: ComputeMethod = cm;
    if (!cm.emissionFactorMappings.length) {
      cmFormatted.emissionFactorMappings = undefined;
    } else {
      cmFormatted.emissionFactorMappings = sortEmissionFactorMappings(cmFormatted.emissionFactorMappings!);
    }
    return cmFormatted;
  });
  

  const computeMethodsMapping = computeMethodsFormatted.reduce((acc: {[computeMethodId: number]: ComputeMethod}, cm) => {
    acc[cm.id] = cm;
    return acc;
  }, {});

  return computeMethodsMapping;
}

const sortEmissionFactorMappings = (emf: EmissionFactorMapping[]) => {
  return emf.sort((emf1, emf2) => {
    if (emf1.emissionFactor.archived && !emf2.emissionFactor.archived) {
      return 1;
    }
    if (!emf1.emissionFactor.archived && emf2.emissionFactor.archived) {
      return -1;
    }
    
    if (emf1.emissionFactor.isPrivate && !emf2.emissionFactor.isPrivate) {
      return -1;
    }
    if (!emf1.emissionFactor.isPrivate && emf2.emissionFactor.isPrivate) {
      return 1;
    }

    if (emf1.recommended && !emf2.recommended) {
      return -1;
    }
    if (!emf1.recommended && emf2.recommended) {
      return 1;
    }

    if (emf1.emissionFactor.notVisible && !emf2.emissionFactor.notVisible) {
      return 1;
    }
    if (!emf1.emissionFactor.notVisible && emf2.emissionFactor.notVisible) {
      return -1;
    }

    return 0;
  });
}

export default reducer;
