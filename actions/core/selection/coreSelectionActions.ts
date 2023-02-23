import { CoreSelectionTypes } from "./types";

export type Action = SetSiteSelection
    | SetProductSelection
    | SetMultipleSelection;

interface SetMultipleSelection {
    type: CoreSelectionTypes.SET_MULTIPLE_SELECTION;
    payload: Record<string, Record<number, boolean>>
}

interface SetSiteSelection {
    type: CoreSelectionTypes.SET_SELECTION_SITE;
    payload: {
        siteId: number;
        check: boolean;
    }
}

interface SetProductSelection {
    type: CoreSelectionTypes.SET_SELECTION_PRODUCT;
    payload: {
        productId: number;
        check: boolean;
    }
}
export function setMultipleSelection(
    payload: SetMultipleSelection["payload"]
){
    return {
        type: CoreSelectionTypes.SET_MULTIPLE_SELECTION,
        payload
    }
}

export function setSiteSelection(
    payload: SetSiteSelection["payload"]
){
    return {
        type: CoreSelectionTypes.SET_SELECTION_SITE,
        payload
    }
}

export function setProductSelection(
    payload: SetProductSelection["payload"]
){
    return {
        type: CoreSelectionTypes.SET_SELECTION_PRODUCT,
        payload
    }
}