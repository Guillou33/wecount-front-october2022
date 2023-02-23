import { CustomEmissionFactorTypes } from "@actions/core/customEmissionFactor/types";
import { Action } from "@actions/core/customEmissionFactor/customEmissionFactorActions";
import { CustomEmissionFactorResponse } from "@lib/wecount-api/responses/apiResponses";
import immer from 'immer';

export type CustomEmissionFactor = CustomEmissionFactorResponse;

export type CustomEmissionFactorList = {
  [cefId: number]: CustomEmissionFactor;
}
interface CustomEmissionFactorState {
  isFetched: boolean;
  isFetching: boolean;
  isCreating: boolean;
  creationError: boolean;
  customEmissionFactors: CustomEmissionFactorList;
}

/**
 * Initial reducer state
 * @type {Object}
 */
const INITIAL_STATE: CustomEmissionFactorState = {
  isFetched: false,
  isFetching: false,
  isCreating: false,
  creationError: false,
  customEmissionFactors: {},
};

/**
 * Updates reducer state depending on action type
 * @param {Object} state - the reducer state
 * @param {Object} action - the fired action object
 * @param {string} action.type - the action type
 * @param {?Object} action.payload - additional action data
 * @return {Object} new reducer state
 */

const reducer = (
  state: CustomEmissionFactorState = INITIAL_STATE,
  action: Action
): CustomEmissionFactorState => {
  switch (action.type) {
    case CustomEmissionFactorTypes.RESET_STATE:
      return {
        ...INITIAL_STATE,
      };
    case CustomEmissionFactorTypes.REQUEST_FETCH_CUSTOM_EMISSION_FACTOR:
      return {
        ...state,
        isFetching: true,
      };
    case CustomEmissionFactorTypes.REQUEST_CREATION_CUSTOM_EMISSION_FACTOR:
      return {
        ...state,
        isCreating: true,
        creationError: false,
      };
    case CustomEmissionFactorTypes.END_CREATION:
      return {
        ...state,
        isCreating: false,
      };
    case CustomEmissionFactorTypes.FETCHED_CUSTOM_EMISSION_FACTOR:
      return {
        ...state,
        isFetching: false,
        isFetched: true,
        customEmissionFactors: formatFromServer(action.payload.customEmissionFactors),
      };
    case CustomEmissionFactorTypes.ARCHIVE_REQUESTED:
      return immer(state, draftState => {
        draftState.customEmissionFactors[action.payload.cefId]!.archivedDate = (new Date()).toISOString();
      });
    case CustomEmissionFactorTypes.UNARCHIVE_REQUESTED:
      return immer(state, draftState => {
        draftState.customEmissionFactors[action.payload.cefId]!.archivedDate = null;
      });
    case CustomEmissionFactorTypes.CREATION_ERROR:
      return immer(state, draftState => {
        draftState.isCreating = false;
        draftState.creationError = true;
      });
    default:
      return state;
  }
};

const formatFromServer = (cefListFromServer: CustomEmissionFactorResponse[]): CustomEmissionFactorList => {
  return cefListFromServer.reduce((cefList: CustomEmissionFactorList, cef) => {
    cefList[cef.id] = {...cef};
    return cefList;
  }, {});
};

export default reducer;
