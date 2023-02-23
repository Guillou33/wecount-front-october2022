import { DashboardsTypes } from "@actions/dashboards/types";
import { Action } from "@actions/dashboards/dashboardsActions";
import { SiteTypes } from "@actions/core/site/types";
import { ProductTypes } from "@actions/core/product/types";
import { Action as SiteAction } from "@actions/core/site/siteActions";
import { Action as ProductAction } from "@actions/core/product/productActions";

function getOtherType(type: OverviewType): OverviewType {
  return type === "sites" ? "products" : "sites";
}

export type OverviewType = "sites" | "products";

export enum DashboardView {
  EMISSION,
  SITES,
  PRODUCTS,
  COMPARISON,
  REGLEMENTATION,
  INDICATORS,
  TRAJECTORY,
  HISTORY,
}

export interface DashboardsState {
  sitesFilter: number[];
  productsFilter: number[];
  overviewType: OverviewType;
  currentView: DashboardView;
}

const initialState: DashboardsState = {
  sitesFilter: [],
  productsFilter: [],
  overviewType: "sites",
  currentView: DashboardView.EMISSION,
};


export default function reducer(
  state: DashboardsState = initialState,
  action: Action | SiteAction | ProductAction
): DashboardsState {
  switch (action.type) {
    case DashboardsTypes.SET_SITES_FILTER:
      return { ...state, sitesFilter: action.payload.siteIds };

    case DashboardsTypes.SET_PRODUCTS_FILTER:
      return { ...state, productsFilter: action.payload.productIds };

    case DashboardsTypes.SET_OVERVIEW_TYPE:
      return { ...state, overviewType: action.payload.overviewType };

    case DashboardsTypes.TOGGLE_OVERVIEW_TYPE:
      return { ...state, overviewType: getOtherType(state.overviewType) };

    case DashboardsTypes.SET_CURRENT_VIEW:
      return { ...state, currentView: action.payload.currentView };

    case SiteTypes.ARCHIVE_REQUESTED: {
      return {
        ...state,
        sitesFilter: state.sitesFilter.filter(
          siteId => siteId !== action.payload.siteId
        ),
      };
    }

    case ProductTypes.ARCHIVE_REQUESTED: {
      return {
        ...state,
        productsFilter: state.productsFilter.filter(
          productId => productId !== action.payload.productId
        ),
      };
    }

    default:
      return state;
  }
}
