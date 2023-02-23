import immer from "immer";

import { DataImportTypes } from "@actions/dataImport/entryData/types";
import { Action } from "@actions/dataImport/entryData/entryDataActions";

import { ComputeMethod } from "@lib/core/dataImport/computeMethod";
import { MappableData } from "@lib/core/dataImport/mappableData";

export type DataImportErrors = "other" | "bad-input" | "forbidden";
export type EntryDataList = Record<string, EntryData>;

export type EntryData = {
  id: string;
  activityCategory: MappableData;
  activityModel: MappableData;
  input1: number | null;
  input2: number | null;
  commentary: string | null;
  source: string | null;
  site: MappableData;
  product: MappableData;
  owner: MappableData;
  writer: MappableData;
  tags: MappableData<number[]>;
  inputInstruction: string | null;
  input1Unit: string | null;
  input2Unit: string | null;
  computeMethod: ComputeMethod | null;
  emissionFactor: { id: number; name: string } | null;
};

export type State = {
  entryDataIsParsing: boolean;
  entryDataList: EntryDataList;
  requestStatus: {
    isSaved: boolean;
    isSaving: boolean;
    error: DataImportErrors | null;
  };
};

const INITIAL_STATE: State = {
  entryDataIsParsing: false,
  entryDataList: {},
  requestStatus: {
    isSaved: false,
    isSaving: false,
    error: null,
  },
};

function reducer(state: State = INITIAL_STATE, action: Action): State {
  switch (action.type) {
    case DataImportTypes.SET_PARSING: {
      return { ...state, entryDataIsParsing: action.payload.isParsing };
    }
    case DataImportTypes.SET_ENTRY_DATA_LIST: {
      return {
        ...state,
        entryDataIsParsing: false,
        entryDataList: action.payload.entryDataList.reduce((acc, entryData) => {
          acc[entryData.id] = entryData;
          return acc;
        }, {} as EntryDataList),
      };
    }
    case DataImportTypes.SET_MAPPABLE_DATA: {
      const { entryDataIds, dataName, id, entityName } = action.payload;
      return immer(state, draftState => {
        entryDataIds.forEach(entryDataId => {
          const mappableData =
            draftState.entryDataList[entryDataId]?.[dataName];
          if (mappableData != null) {
            mappableData.value = id;
            mappableData.entityName = entityName;

            const previousValue =
              state.entryDataList[entryDataId]?.[dataName].value;

            if (dataName === "activityCategory" && previousValue !== id) {
              const activityModelData =
                draftState.entryDataList[entryDataId]?.activityModel;
              if (activityModelData != null) {
                activityModelData.value = null;
              }
            }

            if (dataName === "activityModel" && previousValue !== id) {
              draftState.entryDataList[entryDataId].computeMethod = null;
              draftState.entryDataList[entryDataId].emissionFactor = null;
            }
          }
        });
      });
    }
    case DataImportTypes.SET_NUMBER_DATA: {
      const { entryDataId, dataName, value } = action.payload;
      return immer(state, draftState => {
        const entryData = draftState.entryDataList[entryDataId];
        if (entryData?.[dataName] !== undefined) {
          entryData[dataName] = value;
        }
      });
    }
    case DataImportTypes.SET_STRING_DATA: {
      const { entryDataId, dataName, value } = action.payload;
      return immer(state, draftState => {
        const entryData = draftState.entryDataList[entryDataId];
        if (entryData?.[dataName] != null) {
          entryData[dataName] = value;
        }
      });
    }
    case DataImportTypes.TAG_CLICKED: {
      const { entryDataId, tagId, tagName } = action.payload;
      return immer(state, draftState => {
        const mappableTags = draftState.entryDataList[entryDataId]?.tags;
        if (mappableTags == null) {
          return;
        }
        if (tagId === -1) {
          mappableTags.value = null;
          mappableTags.entityName = tagName;
          return;
        }

        if (mappableTags.value == null) {
          mappableTags.value = [tagId];
          mappableTags.entityName = tagName;
        } else {
          const existingIdIndex = mappableTags.value.findIndex(
            tag => tag === tagId
          );
          const tagNameList = mappableTags.entityName.split(", ");
          const existingTagNameIndex = tagNameList.findIndex(
            name => name === tagName
          );

          if (existingIdIndex !== -1) {
            mappableTags.value.splice(existingIdIndex, 1);
          } else {
            mappableTags.value.push(tagId);
          }

          if (existingTagNameIndex !== -1) {
            tagNameList.splice(existingTagNameIndex, 1);
            mappableTags.entityName = tagNameList.join(", ");
          } else {
            mappableTags.entityName +=
              mappableTags.entityName === "" ? tagName : ", " + tagName;
          }
        }
      });
    }
    case DataImportTypes.SET_COMPUTE_METHOD: {
      const { entryDataIds, computeMethod } = action.payload;
      return immer(state, draftState => {
        entryDataIds.forEach(entryDataId => {
          const entryData = draftState.entryDataList[entryDataId];
          if (entryData != null) {
            entryData.computeMethod = computeMethod;
            entryData.emissionFactor = null;
          }
        });
      });
    }
    case DataImportTypes.SET_EMISSION_FACTOR: {
      const { entryDataIds, emissionFactor } = action.payload;
      return immer(state, draftState => {
        entryDataIds.forEach(entryDataId => {
          const entryData = draftState.entryDataList[entryDataId];
          if (entryData != null) {
            entryData.emissionFactor = emissionFactor;
          }
        });
      });
    }
    case DataImportTypes.SAVE_DATA_REQUESTED: {
      return {
        ...state,
        requestStatus: {
          ...state.requestStatus,
          isSaved: false,
          isSaving: true,
          error: null,
        },
      };
    }
    case DataImportTypes.DATA_SAVED: {
      return {
        ...state,
        requestStatus: {
          ...state.requestStatus,
          isSaving: false,
          isSaved: true,
          error: null,
        },
      };
    }
    case DataImportTypes.DATA_SAVING_FAILED: {
      return {
        ...state,
        requestStatus: {
          ...state.requestStatus,
          isSaving: false,
          isSaved: false,
          error: action.payload.error,
        },
      };
    }
    case DataImportTypes.ERROR_ACKNOLEDGED: {
      return {
        ...state,
        requestStatus: {
          ...state.requestStatus,
          error: null,
        },
      };
    }
    case DataImportTypes.DELETE_ENTRY_DATA: {
      const { entryDataIds } = action.payload;
      return immer(state, draftState => {
        entryDataIds.forEach(entryDataId => {
          delete draftState.entryDataList[entryDataId];
        });
      });
    }
    case DataImportTypes.SET_MULTI_ENTRY_TAGS: {
      const { entryDataIds, tagIds } = action.payload;
      return immer(state, draftState => {
        entryDataIds.forEach(entryDataId => {
          const tagsData = draftState.entryDataList[entryDataId]?.tags;
          if (tagsData == null) {
            return;
          }

          tagsData.value = tagIds.length > 0 ? tagIds : null;
        });
      });
    }
    case DataImportTypes.SET_MULTI_ENTRY_INPUT_UNITS: {
      const { entryDataIds, input1Unit, input2Unit } = action.payload;
      return immer(state, draftState => {
        entryDataIds.forEach(entryDataId => {
          const entryData = draftState.entryDataList[entryDataId];
          if (entryData != null) {
            if (input1Unit != null) {
              entryData.input1Unit = input1Unit;
            }
            if (input2Unit != null) {
              entryData.input2Unit = input2Unit;
            }
          }
        });
      });
    }
    case DataImportTypes.RESET: {
      return { ...INITIAL_STATE };
    }
    default:
      return state;
  }
}

export default reducer;
