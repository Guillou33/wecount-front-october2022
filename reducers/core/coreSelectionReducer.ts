import { Action } from "@actions/core/selection/coreSelectionActions";
import { CoreSelectionTypes } from "@actions/core/selection/types";
import immer from "immer";


interface CoreSelectionState {
    site: Record<number, boolean>;
    product: Record<number, boolean>;
    isCoreSiteSelect: boolean;
    isCoreProductSelect: boolean;
}

/**
 * Initial reducer state
 * @type {Object}
 */
 const INITIAL_STATE: CoreSelectionState = {
    site: {},
    product:  {},
    isCoreSiteSelect: false,
    isCoreProductSelect: false
 }

 /**
  * Updates reducer state depending on action type
  * @param {Object} state - the reducer state
  * @param {Object} action - the fired action object
  * @param {string} action.type - the action type
  * @param {?Object} action.payload - additional action data
  * @return {Object} new reducer state
  */
 
 const reducer = (
   state: CoreSelectionState = INITIAL_STATE,
   action: Action
 ): CoreSelectionState => {
    switch (action.type) {
        case CoreSelectionTypes.SET_MULTIPLE_SELECTION:
            return immer(state, draftState => {
                if(action.payload["site"] !== undefined){
                    draftState.site = action.payload["site"];
                    draftState.isCoreSiteSelect = true;
                }
                if(action.payload["product"] !== undefined){
                    draftState.product = action.payload["product"];
                    draftState.isCoreProductSelect = true;
                }
            });
        case CoreSelectionTypes.SET_SELECTION_SITE:
            return {
                ...state, 
                site: {
                    ...state.site,
                    [action.payload.siteId]: action.payload.check
                },
            };
        case CoreSelectionTypes.SET_SELECTION_PRODUCT:
            return {
                ...state, 
                product: {
                    ...state.product,
                    [action.payload.productId]: action.payload.check
                },
            };
        default:
            return state;
    }
 }

 export default reducer;