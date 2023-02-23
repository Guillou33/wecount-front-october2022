import { EmissionFactorChoiceTypes } from "@actions/emissionFactorChoice/types";
import { Action } from "@actions/emissionFactorChoice/emissionFactorChoiceActions";
import { ComputeMethodType } from "@custom-types/core/ComputeMethodType";
import { EmissionFactor } from "@reducers/entries/campaignEntriesReducer";
import immer from "immer";
import { pullAt } from "lodash";



export interface EmissionFactorFilters {
  db: {
    ademe: boolean;
    ghg: boolean;
    wecount: boolean;
    other: boolean;
  },
  recommended: boolean;
  tags: {
    id: number;
    name: string;
  }[];
  text: string;
}
export interface EmissionFactorModalChoice {
  entryKey: string;
  computeMethodType: ComputeMethodType;
  computeMethodId: number | undefined;
  emissionFactorId: number | undefined;
  customEmissionFactorId: number | undefined;
}
export interface EmissionFactorChoiceReducer {
  modalOpen: boolean;
  entryKey: string | undefined;
  tagColumnOpen: boolean;
  currentComputeMethodType: ComputeMethodType | undefined;
  currentComputeMethodId: number | undefined;
  currentEmissionFactor: EmissionFactor | undefined;
  currentActivityModelId: number | undefined;
  isSearchingEF: boolean;
  efSearchMissesCharacters: boolean;
  currentDataInited: boolean;
  emissionFactorFilters: EmissionFactorFilters;
  lastChoice: EmissionFactorModalChoice | undefined;
}

/**
 * Initial reducer state
 * @type {Object}
 */
const INITIAL_STATE: EmissionFactorChoiceReducer = {
  modalOpen: false,
  entryKey: undefined,
  tagColumnOpen: false,
  currentComputeMethodType: undefined,
  currentComputeMethodId: undefined,
  currentEmissionFactor: undefined,
  currentDataInited: false,
  currentActivityModelId: undefined,
  isSearchingEF: false,
  efSearchMissesCharacters: false,
  emissionFactorFilters: {
    db: {
      ademe: false,
      ghg: false,
      wecount: false,
      other: false,
    },
    recommended: false,
    tags: [],
    text: '',
  },
  lastChoice: undefined,
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
  state: EmissionFactorChoiceReducer = INITIAL_STATE,
  action: Action
): EmissionFactorChoiceReducer => {
  switch (action.type) {
    case EmissionFactorChoiceTypes.START_SEARCHING_EF:
      return {
        ...state,
        isSearchingEF: true,
      }
    case EmissionFactorChoiceTypes.STOP_SEARCHING_EF:
      return {
        ...state,
        isSearchingEF: false,
      }
    case EmissionFactorChoiceTypes.NOT_ENOUGH_CHARACTERS_EF_SEARCH_ERROR:
      return {
        ...state,
        efSearchMissesCharacters: true,
      }
    case EmissionFactorChoiceTypes.NOT_ENOUGH_CHARACTERS_EF_SEARCH_ERROR_REMOVED:
      return {
        ...state,
        efSearchMissesCharacters: false,
      }
    case EmissionFactorChoiceTypes.CHOOSER_INITED:
      return {
        ...state,
        modalOpen: true,
        entryKey: action.payload.entryKey,
      }
    case EmissionFactorChoiceTypes.CURRENT_DATA_INITED:
      return {
        ...state,
        modalOpen: true,
        currentDataInited: true,
        currentComputeMethodType: action.payload.computeMethodType,
        currentComputeMethodId: action.payload.computeMethodId,
        currentEmissionFactor: action.payload.emissionFactor,
        currentActivityModelId: action.payload.activityModelId,
      }
    case EmissionFactorChoiceTypes.MODAL_OPEN:
      if (action.payload.isOpen) {
        state.modalOpen = true;
        return {
          ...state,
          modalOpen: true,
        };
      }
      return {
        ...INITIAL_STATE,
        lastChoice: state.lastChoice,
      };
    case EmissionFactorChoiceTypes.TAG_COLUMN_OPEN:
      return {
        ...state,
        tagColumnOpen: action.payload.isOpen,
      }
    case EmissionFactorChoiceTypes.FILTER_DB_TOGGLED:
      return {
        ...state,
        emissionFactorFilters: {
          ...state.emissionFactorFilters,
          db: {
            ...state.emissionFactorFilters.db,
            [action.payload.dbName]: !state.emissionFactorFilters.db[action.payload.dbName]
          }
        }
      };
    case EmissionFactorChoiceTypes.FILTER_RECOMMENDED_TOGGLED:
      return {
        ...state,
        emissionFactorFilters: {
          ...state.emissionFactorFilters,
          recommended: !state.emissionFactorFilters.recommended,
        }
      };
    case EmissionFactorChoiceTypes.COMPUTE_METHOD_ID_UPDATED:
      return {
        ...state,
        currentComputeMethodType: ComputeMethodType.STANDARD,
        currentComputeMethodId: action.payload.computeMethodId,
      };
    case EmissionFactorChoiceTypes.COMPUTE_METHOD_TYPE_UPDATED:
      return {
        ...state,
        currentComputeMethodType: action.payload.computeMethodType,
        currentComputeMethodId: undefined,
      };
    case EmissionFactorChoiceTypes.FILTER_TAG_TOGGLED:
      return immer(state, (draftState) => {
        const foundIndex = state.emissionFactorFilters.tags.findIndex(tag => tag.id === action.payload.tag.id);
        if (foundIndex !== -1) {
          const newTags = [...state.emissionFactorFilters.tags];
          pullAt(newTags, [foundIndex]);
          draftState.emissionFactorFilters.tags = newTags;
        } else {
          if (!action.payload.tag.name) {
            throw new Error('Tag name is not defined');
          }
          draftState.emissionFactorFilters.tags.push({
            id: action.payload.tag.id,
            name: action.payload.tag.name as string,
          });
        }
      });
    case EmissionFactorChoiceTypes.FILTER_EF_TEXT_CHANGED:
      return immer(state, (draftState) => {
        draftState.emissionFactorFilters.text = action.payload.text;
      });
    case EmissionFactorChoiceTypes.FILTER_EF_REFRESHED:
      return {
        ...state,
        emissionFactorFilters: {
          ...INITIAL_STATE.emissionFactorFilters
        }
      };
    case EmissionFactorChoiceTypes.LAST_CHOICE_UPDATED:
      return {
        ...state,
        lastChoice: {
          entryKey: state.entryKey!,
          computeMethodType: state.currentComputeMethodType!,
          computeMethodId: state.currentComputeMethodId,
          emissionFactorId: action.payload.emissionFactorId,
          customEmissionFactorId: action.payload.customEmissionFactorId,
        }
      }
    default:
      return state;
  }
};

export default reducer;
