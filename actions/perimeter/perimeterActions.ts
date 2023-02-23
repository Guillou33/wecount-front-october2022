import { PerimeterTypes } from "@actions/perimeter/types";
import { PerimeterManagementViewItem } from "@components/perimeter/sub/PerimeterManagementView";
import { CampaignStatus } from "@custom-types/core/CampaignStatus";
import { CustomThunkAction } from "@custom-types/redux";
import { Scope } from "@custom-types/wecount-api/activity";
import ApiClient from "@lib/wecount-api/ApiClient";
import { PerimeterActivityResponse, PerimeterEmissionsResponse, PerimeterFullResponse, PerimeterResponse } from "@lib/wecount-api/responses/apiResponses";
import { ApiRoutes } from "@lib/wecount-api/routes/apiRoutes";
import { ShowActivityModelsInTable } from "@reducers/perimeter/perimeterReducer";
import { Dispatch } from "redux";

export type Action =
  | SetAllPerimeterRequestStarted
  | SetAllPerimeter
  | SetPerimetersEmissions
  | SetCurrentPerimeter
  | SwitchCurrentPerimeterRequested
  | PerimeterCreationRequested
  | PerimeterUpdateRequested
  | AppendPerimeter
  | RemovePerimeter
  | UpdatePerimeter
  | SetPerimeterCreating
  | SetPerimeterManagementView
  | SetExcludedData
  | SetSelectionForSynthesis
  | SetStatusForSynthesis
  | SetYearsForSynthesis
  | ClearFilters
  | SetShowCategoriesForSynthesis
  | SetShowActivityModelsForSynthesis;

type LoadPerimeterOptions = {
  setCurrent?: boolean;
};

interface SetAllPerimeter {
  type: PerimeterTypes.SET_ALL_PERIMETERS;
  payload: PerimeterResponse[];
}

interface SetAllPerimeterRequestStarted {
  type: PerimeterTypes.SET_ALL_PERIMETERS_REQUEST_STARTED;
}

interface SetPerimetersEmissions {
  type: PerimeterTypes.SET_PERIMETERS_EMISSIONS;
  payload: PerimeterFullResponse;
}

interface SetCurrentPerimeter {
  type: PerimeterTypes.SET_CURRENT_PERIMETER;
  payload: number;
}

interface AppendPerimeter {
  type: PerimeterTypes.APPEND_PERIMETER;
  payload: { id: number; name: string; description: string | null };
}

interface RemovePerimeter {
  type: PerimeterTypes.REMOVE_PERIMETER;
  payload: number;
}

interface SetPerimeterCreating {
  type: PerimeterTypes.SET_PERIMETER_CREATING;
  payload: boolean;
}

export interface SwitchCurrentPerimeterRequested {
  type: PerimeterTypes.SWITCH_CURRENT_PERIMETER_REQUESTED;
  payload: number;
}

export interface PerimeterCreationRequested {
  type: PerimeterTypes.PERIMETER_CREATION_REQUESTED;
  payload: {
    name: string;
    description: string | null;
  };
}

export interface PerimeterDeletionRequested {
  type: PerimeterTypes.PERIMETER_DELETION_REQUESTED;
  payload: number;
}

export interface PerimeterUpdateRequested {
  type: PerimeterTypes.PERIMETER_UPDATE_REQUESTED;
  payload: {
    id: number;
    name: string;
    description: string | null;
  };
}

export interface UpdatePerimeter {
  type: PerimeterTypes.UPDATE_PERIMETER;
  payload: {
    id: number;
    name: string;
    description: string | null;
  };
}

export interface SetExcludedData {
  type: PerimeterTypes.SET_EXCLUDED_DATA;
  payload: {
    excluded: number;
  }
}

export interface SetSelectionForSynthesis {
  type: PerimeterTypes.SET_SELECTION_FOR_SYNTHESIS;
  payload: {
    selection: number[];
  }
}

export interface SetStatusForSynthesis {
  type: PerimeterTypes.SET_STATUS_FOR_SYNTHESIS;
  payload: {
    status: CampaignStatus[];
  }
}

export interface SetYearsForSynthesis {
  type: PerimeterTypes.SET_YEARS_FOR_SYNTHESIS;
  payload: {
    years: number[];
  }
}

export interface ClearFilters{
  type: PerimeterTypes.CLEAR_FILTERS;
  payload: {}
}

export interface SetShowCategoriesForSynthesis {
  type: PerimeterTypes.SHOW_CATEGORIES_FOR_SYNTHESIS;
  payload: {
    categories: {
      [Scope.UPSTREAM]: boolean,
      [Scope.CORE]: boolean,
      [Scope.DOWNSTREAM]: boolean
    },
    rowCategories: string;
  }
}

export interface SetShowActivityModelsForSynthesis {
  type: PerimeterTypes.SHOW_ACTIVITY_MODELS_FOR_SYNTHESIS;
  payload: {
    activityModels: ShowActivityModelsInTable;
    rowActivityModels: string;
  }
}

export interface SetPerimeterManagementView {
  type: PerimeterTypes.SET_PERIMETER_MANAGEMENT_VIEW;
  payload: {
    perimeterView: PerimeterManagementViewItem;
  }
}

export function setPerimeterManagementView(perimeterView: PerimeterManagementViewItem): SetPerimeterManagementView {
  return {
    type: PerimeterTypes.SET_PERIMETER_MANAGEMENT_VIEW,
    payload: {
      perimeterView
    },
  };
}

export function setAllPerimeters(
  perimeters: PerimeterResponse[]
): SetAllPerimeter {
  return {
    type: PerimeterTypes.SET_ALL_PERIMETERS,
    payload: perimeters,
  };
}

export function setPerimetersEmissions(): CustomThunkAction{
  return async (dispatch, getState) => {
    const apiClient = ApiClient.buildFromBrowser();

    const response = await apiClient.get<PerimeterFullResponse>(
      ApiRoutes.PERIMETERS_EMISSIONS_SYNTHESIS
    );

    dispatch({
      type: PerimeterTypes.SET_PERIMETERS_EMISSIONS,
      payload: response.data
    });
  }  

}

export function setPerimetersEmissionsFromApi({
  activities,
  synthesis
}: {
  activities: PerimeterActivityResponse[],
  synthesis: PerimeterEmissionsResponse[]
}): SetPerimetersEmissions {
  return {
    type: PerimeterTypes.SET_PERIMETERS_EMISSIONS,
    payload: {
      activities, 
      synthesis
    },
  }
}

export function setAllPerimetersRequestStarted(): SetAllPerimeterRequestStarted {
  return {
    type: PerimeterTypes.SET_ALL_PERIMETERS_REQUEST_STARTED,
  };
}

export function loadAllPerimeters({
  setCurrent = true,
}: LoadPerimeterOptions = {}): CustomThunkAction {
  return async (dispatch, getState) => {
    const apiClient = ApiClient.buildFromBrowser();

    dispatch(setAllPerimetersRequestStarted());

    const response = await apiClient.get<PerimeterResponse[]>(
      ApiRoutes.PERIMETERS
    );

    dispatch(setAllPerimeters(response.data));

    const firstPerimeter = response.data[0];

    if (
      setCurrent &&
      firstPerimeter != null &&
      getState().perimeter.currentPerimeter == null
    ) {
      dispatch(setCurrentPerimeter(firstPerimeter.id));
    }

    if(getState().perimeter.emissionsFetched === false){
      dispatch(setPerimetersEmissions())
    }
  };
}

export function setCurrentPerimeter(perimeterId: number): SetCurrentPerimeter {
  return {
    type: PerimeterTypes.SET_CURRENT_PERIMETER,
    payload: perimeterId,
  };
}

export function requestCurrentPerimeterSwitch(
  perimeterId: number
): SwitchCurrentPerimeterRequested {
  return {
    type: PerimeterTypes.SWITCH_CURRENT_PERIMETER_REQUESTED,
    payload: perimeterId,
  };
}

export function requestPerimeterCreation({
  name,
  description,
}: {
  name: string;
  description: string | null;
}): PerimeterCreationRequested {
  return {
    type: PerimeterTypes.PERIMETER_CREATION_REQUESTED,
    payload: {
      name,
      description,
    },
  };
}

export function appendPerimeter({
  id,
  name,
  description,
}: {
  id: number;
  name: string;
  description: string | null;
}): AppendPerimeter {
  return {
    type: PerimeterTypes.APPEND_PERIMETER,
    payload: {
      id,
      name,
      description,
    },
  };
}

export function setPerimeterCreating(
  isCreating: boolean
): SetPerimeterCreating {
  return {
    type: PerimeterTypes.SET_PERIMETER_CREATING,
    payload: isCreating,
  };
}

export function requestPerimeterDeletion(
  perimeterId: number
): PerimeterDeletionRequested {
  return {
    type: PerimeterTypes.PERIMETER_DELETION_REQUESTED,
    payload: perimeterId,
  };
}

export function removePerimeter(perimeterId: number): RemovePerimeter {
  return {
    type: PerimeterTypes.REMOVE_PERIMETER,
    payload: perimeterId,
  };
}

export function requestPerimeterUpdate({
  id,
  name,
  description,
}: {
  id: number;
  name: string;
  description: string | null;
}): PerimeterUpdateRequested {
  return {
    type: PerimeterTypes.PERIMETER_UPDATE_REQUESTED,
    payload: {
      id,
      name,
      description,
    },
  };
}

export function updatePerimeter({
  id,
  name,
  description,
}: {
  id: number;
  name: string;
  description: string | null;
}): UpdatePerimeter {
  return {
    type: PerimeterTypes.UPDATE_PERIMETER,
    payload: {
      id,
      name,
      description,
    },
  };
}

export function setExcludedData({
  excluded,
}: {
  excluded: number,
}, onRefreshed: (excluded: number) => void): CustomThunkAction {
  return async (dispatch: Dispatch, getState) => {
    dispatch<SetExcludedData>({
      type: PerimeterTypes.SET_EXCLUDED_DATA,
      payload: {
        excluded
      },
    });
    onRefreshed(excluded);
  }
}

export function selectCampaignsForSynthesis(
  selection: number[],
): CustomThunkAction {
  return async (dispatch: Dispatch, getState) => {
    dispatch<SetSelectionForSynthesis>({
      type: PerimeterTypes.SET_SELECTION_FOR_SYNTHESIS,
      payload: {
        selection,
      },
    });
  }
}

export function selectCampaignStatusForSynthesis(
  status: CampaignStatus[],
): CustomThunkAction {
  return async (dispatch: Dispatch, getState) => {
    dispatch<SetStatusForSynthesis>({
      type: PerimeterTypes.SET_STATUS_FOR_SYNTHESIS,
      payload: {
        status,
      },
    });
  }
}

export function selectCampaignsYearsForSynthesis(
  years: number[],
): CustomThunkAction {
  return async (dispatch: Dispatch, getState) => {
    dispatch<SetYearsForSynthesis>({
      type: PerimeterTypes.SET_YEARS_FOR_SYNTHESIS,
      payload: {
        years,
      },
    });
  }
}

export function clearFilters (): CustomThunkAction {
  return async (dispatch: Dispatch, getState) => {
    dispatch<ClearFilters>({
      type: PerimeterTypes.CLEAR_FILTERS,
      payload: {}
    })
  }
}

export function setShowCategoriesEmissions(
  categories: {
    [Scope.UPSTREAM]: boolean,
    [Scope.CORE]: boolean,
    [Scope.DOWNSTREAM]: boolean
  }
): CustomThunkAction {
  return async (dispatch: Dispatch, getState) => {
    dispatch<SetShowCategoriesForSynthesis>({
      type: PerimeterTypes.SHOW_CATEGORIES_FOR_SYNTHESIS,
      payload: {
        categories,
        rowCategories: "emissions"
      },
    });
  }
}

export function setShowActivityModelsEmissions(
  activityModels: ShowActivityModelsInTable
): CustomThunkAction {
  return async (dispatch: Dispatch, getState) => {

    dispatch<SetShowActivityModelsForSynthesis>({
      type: PerimeterTypes.SHOW_ACTIVITY_MODELS_FOR_SYNTHESIS,
      payload: {
        activityModels,
        rowActivityModels: "emissions"
      },
    });
  }
}

export function setShowCategoriesPercentages(
  categories: {
    [Scope.UPSTREAM]: boolean,
    [Scope.CORE]: boolean,
    [Scope.DOWNSTREAM]: boolean
  }
): CustomThunkAction {
  return async (dispatch: Dispatch, getState) => {
    dispatch<SetShowCategoriesForSynthesis>({
      type: PerimeterTypes.SHOW_CATEGORIES_FOR_SYNTHESIS,
      payload: {
        categories,
        rowCategories: "percentages"
      },
    });
  }
}

export function setShowActivityModelsPercentages(
  activityModels: ShowActivityModelsInTable
): CustomThunkAction {
  return async (dispatch: Dispatch, getState) => {

    dispatch<SetShowActivityModelsForSynthesis>({
      type: PerimeterTypes.SHOW_ACTIVITY_MODELS_FOR_SYNTHESIS,
      payload: {
        activityModels,
        rowActivityModels: "percentages"
      },
    });
  }
}
