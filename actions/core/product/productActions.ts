import { Dispatch } from "redux";
import ApiClient from "@lib/wecount-api/ApiClient";
import { CustomThunkAction } from "@custom-types/redux";
import { ProductTypes } from "@actions/core/product/types";
import { ApiRoutes, generateRoute } from "@lib/wecount-api/routes/apiRoutes";
import { ProductListResponse, ProductResponse } from "@lib/wecount-api/responses/apiResponses";

export type Action =
  | SetProductsAction
  | SetIsProductsFetchingAction
  | SetFetchError
  | ArchiveRequestedAction
  | MultipleArchiveRequested
  | UnarchiveRequestedAction
  | UpdateNameRequestedAction
  | UpdateDescriptionRequestedAction
  | UpdateQuantityRequestedAction
  | CreateRequestedAction
  | CreatedAction
  | CreationErrorAction
  | CreationErrorRemovedAction
  | ResetProductsState;

export interface CreateRequestedAction {
  type: ProductTypes.CREATE_REQUESTED;
  payload: {
    perimeterId: number;
    name: string;
    description: string | null;
    quantity: number | null;
  }
}

interface CreatedAction {
  type: ProductTypes.CREATED;
  payload: {
    product: ProductResponse
  };
}

interface CreationErrorAction {
  type: ProductTypes.CREATION_ERROR;
}

interface CreationErrorRemovedAction {
  type: ProductTypes.CREATION_ERROR_REMOVED;
}

interface SetIsProductsFetchingAction {
  type: ProductTypes.IS_FETCHING;
}

interface SetFetchError {
  type: ProductTypes.FETCH_ERROR;
}

export interface ArchiveRequestedAction {
  type: ProductTypes.ARCHIVE_REQUESTED;
  payload: {
    productId: number;
  };
}

export interface MultipleArchiveRequested {
  type: ProductTypes.MULTIPLE_ARCHIVE_REQUESTED;
  payload: {
    listIds: number[];
  }
}
export interface UnarchiveRequestedAction {
  type: ProductTypes.UNARCHIVE_REQUESTED;
  payload: {
    productId: number;
  };
}

export interface UpdateNameRequestedAction {
  type: ProductTypes.UPDATE_NAME_REQUESTED;
  payload: {
    productId: number;
    newName: string;
  };
}

export interface UpdateDescriptionRequestedAction {
  type: ProductTypes.UPDATE_DESCRIPTION_REQUESTED;
  payload: {
    productId: number;
    newDescription: string | null;
  };
}

export interface UpdateQuantityRequestedAction {
  type: ProductTypes.UPDATE_QUANTITY_REQUESTED;
  payload: {
    productId: number;
    newQuantity: number | null;
  };
}

interface SetProductsAction {
  type: ProductTypes.SET_PRODUCTS;
  payload: {
    productList: ProductListResponse;
  };
}

interface ResetProductsState {
  type: ProductTypes.RESET_PRODUCTS_STATE;
}

export const setProducts = (
  perimeterId: number,
  customApiClient?: ApiClient
): CustomThunkAction => {
  return async (dispatch: Dispatch, getState) => {
    const state = getState();
    if (state.core.product.isFetching) return;

    dispatch<SetIsProductsFetchingAction>({
      type: ProductTypes.IS_FETCHING,
    });
    const apiClient = customApiClient ?? ApiClient.buildFromBrowser();
    try {
      const response = await apiClient.get<ProductListResponse>(
        generateRoute(ApiRoutes.PERIMETERS_PRODUCTS, { id: perimeterId })
      );
      dispatch<SetProductsAction>({
        type: ProductTypes.SET_PRODUCTS,
        payload: {
          productList: response.data,
        },
      });
    } catch (error: any) {
      dispatch<SetFetchError>({
        type: ProductTypes.FETCH_ERROR,
      });
      throw error;
    }
  };
};

export const requestArchive = (productId: number): ArchiveRequestedAction => ({
  type: ProductTypes.ARCHIVE_REQUESTED,
  payload: {
    productId,
  },
});

export const requestMultipleArchive = (listIds: number[]): MultipleArchiveRequested => ({
  type: ProductTypes.MULTIPLE_ARCHIVE_REQUESTED,
  payload: {
    listIds
  },
});

export const requestUnarchive = (productId: number): UnarchiveRequestedAction => ({
  type: ProductTypes.UNARCHIVE_REQUESTED,
  payload: {
    productId,
  },
});

export const requestUpdateName = ({
  productId,
  newName,
}: {
  productId: number;
  newName: string;
}): UpdateNameRequestedAction => ({
  type: ProductTypes.UPDATE_NAME_REQUESTED,
  payload: {
    productId,
    newName,
  },
});

export const requestUpdateDescription = ({
  productId,
  newDescription,
}: {
  productId: number;
  newDescription: string | null;
}): UpdateDescriptionRequestedAction => ({
  type: ProductTypes.UPDATE_DESCRIPTION_REQUESTED,
  payload: {
    productId,
    newDescription,
  },
});

export const requestUpdateQuantity = ({
  productId,
  newQuantity,
}: {
  productId: number;
  newQuantity: number | null;
}): UpdateQuantityRequestedAction => ({
  type: ProductTypes.UPDATE_QUANTITY_REQUESTED,
  payload: {
    productId,
    newQuantity,
  },
});

export const requestCreation = ({
  perimeterId,
  name,
  description,
  quantity,
}: {
  perimeterId: number,
  name: string;
  description: string | null;
  quantity: number | null;
}): CreateRequestedAction => ({
  type: ProductTypes.CREATE_REQUESTED,
  payload: {
    perimeterId,
    name,
    description,
    quantity,
  },
});

export const setCreated = (product: ProductResponse): CreatedAction => ({
  type: ProductTypes.CREATED,
  payload: {
    product,
  },
});

export const setCreationError = (): CreationErrorAction => ({
  type: ProductTypes.CREATION_ERROR,
});

export const removeCreationError = (): CreationErrorRemovedAction => ({
  type: ProductTypes.CREATION_ERROR_REMOVED,
});

export function resetProductsState(): ResetProductsState {
  return {
    type: ProductTypes.RESET_PRODUCTS_STATE,
  };
}

