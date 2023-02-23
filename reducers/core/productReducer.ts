import { ProductTypes } from "@actions/core/product/types";
import { Action } from "@actions/core/product/productActions";
import { ProductListResponse } from "@lib/wecount-api/responses/apiResponses";
import immer from 'immer';

export interface Product {
  id: number
  name: string;
  description: string | null;
  quantity: number | null;
  archivedDate: string | null;
  createdAt: string;
}

export type ProductList = { [productId: number]: Product };

interface ProductState {
  productList: ProductList;
  isFetched: boolean;
  isFetching: boolean;
  isCreating: boolean;
  creationError: boolean;
}

/**
 * Initial reducer state
 * @type {Object}
 */
const INITIAL_STATE: ProductState = {
  productList: {},
  isFetching: false,
  isFetched: false,
  isCreating: false,
  creationError: false,
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
  state: ProductState = INITIAL_STATE,
  action: Action
): ProductState => {
  switch (action.type) {
    case ProductTypes.IS_FETCHING:
      return {
        ...state, 
        isFetching: true,
      };
    case ProductTypes.FETCH_ERROR:
      return {
        ...state, 
        isFetching: false,
      };
    case ProductTypes.SET_PRODUCTS:
      return {
        ...state, 
        productList: formatFromServer(action.payload.productList),
        isFetched: true,
        isFetching: false,
      };
    case ProductTypes.ARCHIVE_REQUESTED:
      return immer(state, draftState => {
        draftState.productList[action.payload.productId]!.archivedDate = (new Date()).toISOString();
      });
    case ProductTypes.MULTIPLE_ARCHIVE_REQUESTED:
      return immer(state, draftState => {
        const newArchivedProducts = action.payload.listIds.map(id => {
          draftState.productList[id]!.archivedDate = (new Date()).toISOString();
        });
      }); 
    case ProductTypes.UNARCHIVE_REQUESTED:
      return immer(state, draftState => {
        draftState.productList[action.payload.productId]!.archivedDate = null;
      });
    case ProductTypes.UPDATE_NAME_REQUESTED:
      return immer(state, draftState => {
        draftState.productList[action.payload.productId]!.name = action.payload.newName;
      });
    case ProductTypes.UPDATE_DESCRIPTION_REQUESTED:
      return immer(state, draftState => {
        draftState.productList[action.payload.productId]!.description = action.payload.newDescription;
      });
    case ProductTypes.UPDATE_QUANTITY_REQUESTED:
      return immer(state, draftState => {
        draftState.productList[action.payload.productId]!.quantity = action.payload.newQuantity;
      });
    case ProductTypes.CREATED:
      return immer(state, draftState => {
        draftState.productList[action.payload.product.id] = action.payload.product;
        draftState.isCreating = false;
      });
    case ProductTypes.CREATE_REQUESTED:
      return immer(state, draftState => {
        draftState.isCreating = true;
        draftState.creationError = false;
      });
    case ProductTypes.CREATION_ERROR:
      return immer(state, draftState => {
        draftState.isCreating = false;
        draftState.creationError = true;
      });
    case ProductTypes.CREATION_ERROR_REMOVED:
      return immer(state, draftState => {
        draftState.creationError = false;
      });
    case ProductTypes.RESET_PRODUCTS_STATE:
      return INITIAL_STATE;
    default:
      return state;
  }
};

const formatFromServer = (productListFromServer: ProductListResponse): ProductList => {
  return productListFromServer.reduce((productList: ProductList, product) => {
    productList[product.id] = {...product};
    return productList;
  }, {});
};

export default reducer;
