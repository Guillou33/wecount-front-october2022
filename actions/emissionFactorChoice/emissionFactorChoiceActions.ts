import { ComputeMethodType } from "@custom-types/core/ComputeMethodType";
import { EmissionFactorModalChoice } from "@reducers/emissionFactorChoice/emissionFactorChoiceReducer";
import { EmissionFactor } from "@reducers/entries/campaignEntriesReducer";
import { EmissionFactorChoiceTypes } from "./types";

export type Action =
  | ModalOpenAction
  | TagColumnOpenAction
  | CurrentDataInitedAction
  | ChooserInitedAtion
  | ComputeMethodIdUpdatedAction
  | ComputeMethodTypeUpdatedAction
  | FilterDbToggledAction
  | FilterRecommendedToggledAction
  | FilterTagToggledAction
  | FilterEfTextChangedAction
  | FilterEfRefreshedAction
  | LastChoiceUpdatedAction
  | StartSearchingEfAction
  | StopSearchingEfAction
  | NotInoughCharchtersEfSearchAction
  | NotInoughCharchtersEfSearchRemovedAction
;

interface TagColumnOpenAction {
  type: EmissionFactorChoiceTypes.TAG_COLUMN_OPEN;
  payload: {
    isOpen: boolean;
  };
}

interface ModalOpenAction {
  type: EmissionFactorChoiceTypes.MODAL_OPEN;
  payload: {
    isOpen: boolean;
  };
}

interface ChooserInitedAtion {
  type: EmissionFactorChoiceTypes.CHOOSER_INITED;
  payload: {
    entryKey: string;
  };
}
interface CurrentDataInitedAction {
  type: EmissionFactorChoiceTypes.CURRENT_DATA_INITED;
  payload: {
    computeMethodType: ComputeMethodType | undefined;
    computeMethodId: number | undefined;
    emissionFactor: EmissionFactor | undefined;
    activityModelId: number;
  };
}
interface ComputeMethodIdUpdatedAction {
  type: EmissionFactorChoiceTypes.COMPUTE_METHOD_ID_UPDATED;
  payload: {
    computeMethodId: number;
    
  }
}
interface ComputeMethodTypeUpdatedAction {
  type: EmissionFactorChoiceTypes.COMPUTE_METHOD_TYPE_UPDATED;
  payload: {
    computeMethodType: ComputeMethodType;
  }
}
interface FilterDbToggledAction {
  type: EmissionFactorChoiceTypes.FILTER_DB_TOGGLED;
  payload: {
    dbName: "ademe" | "ghg" | "wecount" | "other";
  };
}
interface FilterTagToggledAction {
  type: EmissionFactorChoiceTypes.FILTER_TAG_TOGGLED;
  payload: {
    tag: {
      id: number;
      name?: string;
    }
  };
}
interface FilterEfTextChangedAction {
  type: EmissionFactorChoiceTypes.FILTER_EF_TEXT_CHANGED;
  payload: {
    text: string;
  };
}
interface FilterRecommendedToggledAction {
  type: EmissionFactorChoiceTypes.FILTER_RECOMMENDED_TOGGLED;
}
interface FilterEfRefreshedAction {
  type: EmissionFactorChoiceTypes.FILTER_EF_REFRESHED;
}
interface StartSearchingEfAction {
  type: EmissionFactorChoiceTypes.START_SEARCHING_EF;
}

interface StopSearchingEfAction {
  type: EmissionFactorChoiceTypes.STOP_SEARCHING_EF;
}
interface NotInoughCharchtersEfSearchAction {
  type: EmissionFactorChoiceTypes.NOT_ENOUGH_CHARACTERS_EF_SEARCH_ERROR;
}
interface NotInoughCharchtersEfSearchRemovedAction {
  type: EmissionFactorChoiceTypes.NOT_ENOUGH_CHARACTERS_EF_SEARCH_ERROR_REMOVED;
}

interface LastChoiceUpdatedAction {
  type: EmissionFactorChoiceTypes.LAST_CHOICE_UPDATED;
  payload: {
    emissionFactorId?: number,
    customEmissionFactorId?: number,
  }
}

export function setModalOpen(isOpen: boolean): ModalOpenAction {
  return {
    type: EmissionFactorChoiceTypes.MODAL_OPEN,
    payload: {
      isOpen,
    },
  };
}

export function setTagColumnOpen(isOpen: boolean): TagColumnOpenAction {
  return {
    type: EmissionFactorChoiceTypes.TAG_COLUMN_OPEN,
    payload: {
      isOpen,
    },
  };
}

export function initEFChooser(entryKey: string): ChooserInitedAtion {
  return {
    type: EmissionFactorChoiceTypes.CHOOSER_INITED,
    payload: {
      entryKey,
    },
  };
}

export function initCurrentData({
  computeMethodType,
  computeMethodId,
  emissionFactor,
  activityModelId,
}: {
  computeMethodType: ComputeMethodType | undefined;
  computeMethodId: number | undefined;
  emissionFactor: EmissionFactor | undefined;
  activityModelId: number;
}): CurrentDataInitedAction {
  return {
    type: EmissionFactorChoiceTypes.CURRENT_DATA_INITED,
    payload: {
      computeMethodType,
      computeMethodId,
      emissionFactor,
      activityModelId,
    },
  };
}

export function toggleFilterDb(
  dbName: "ademe" | "ghg" | "wecount" | "other"
): FilterDbToggledAction {
  return {
    type: EmissionFactorChoiceTypes.FILTER_DB_TOGGLED,
    payload: {
      dbName,
    },
  };
}

export const toggleFilterRecommended = (): FilterRecommendedToggledAction => {
  return {
    type: EmissionFactorChoiceTypes.FILTER_RECOMMENDED_TOGGLED,
  };
};

export const toggleFilterTag = ({
  id,
  name,
}: {
  id: number;
  name?: string;
}): FilterTagToggledAction => {
  return {
    type: EmissionFactorChoiceTypes.FILTER_TAG_TOGGLED,
    payload: {
      tag: {
        id,
        name,
      },
    },
  };
};

export function updateComputeMethodId(computeMethodId: number): ComputeMethodIdUpdatedAction {
  return {
    type: EmissionFactorChoiceTypes.COMPUTE_METHOD_ID_UPDATED,
    payload: {
      computeMethodId,
    },
  };
}

export function updateFilterEfText(text: string): FilterEfTextChangedAction {
  return {
    type: EmissionFactorChoiceTypes.FILTER_EF_TEXT_CHANGED,
    payload: {
      text,
    },
  };
}

export function refreshEfFilters(): FilterEfRefreshedAction {
  return {
    type: EmissionFactorChoiceTypes.FILTER_EF_REFRESHED,
  };
}

export function startSearching(): StartSearchingEfAction {
  return {
    type: EmissionFactorChoiceTypes.START_SEARCHING_EF,
  };
}

export function stopSearching(): StopSearchingEfAction {
  return {
    type: EmissionFactorChoiceTypes.STOP_SEARCHING_EF,
  };
}

export function setNotEnoughCharchtersEfSearchError(): NotInoughCharchtersEfSearchAction {
  return {
    type: EmissionFactorChoiceTypes.NOT_ENOUGH_CHARACTERS_EF_SEARCH_ERROR,
  };
}

export function removeNotEnoughCharchtersEfSearchError(): NotInoughCharchtersEfSearchRemovedAction {
  return {
    type: EmissionFactorChoiceTypes.NOT_ENOUGH_CHARACTERS_EF_SEARCH_ERROR_REMOVED,
  };
}

export function updateLastChoice({
  emissionFactorId,
  customEmissionFactorId,
}: {
  emissionFactorId?: number,
  customEmissionFactorId?: number,
}): LastChoiceUpdatedAction {
  return {
    type: EmissionFactorChoiceTypes.LAST_CHOICE_UPDATED,
    payload: {
      emissionFactorId,
      customEmissionFactorId,
    },
  };
}

export function updateComputeMethodType(computeMethodType: ComputeMethodType): ComputeMethodTypeUpdatedAction {
  return {
    type: EmissionFactorChoiceTypes.COMPUTE_METHOD_TYPE_UPDATED,
    payload: {
      computeMethodType,
    },
  };
}
