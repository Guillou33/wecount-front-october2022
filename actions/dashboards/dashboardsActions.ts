import { DashboardsTypes } from "@actions/dashboards/types";
import {
  OverviewType,
  DashboardView,
} from "@reducers/dashboards/dashboardsReducer";

export type Action =
  | SetSitesFilter
  | SetProductsFilter
  | SetOverviewType
  | ToggleOverviewType
  | SetCurrentView;


type SetSitesFilter = {
  type: DashboardsTypes.SET_SITES_FILTER;
  payload: {
    siteIds: number[];
  };
};

type SetProductsFilter = {
  type: DashboardsTypes.SET_PRODUCTS_FILTER;
  payload: {
    productIds: number[];
  };
};

type SetOverviewType = {
  type: DashboardsTypes.SET_OVERVIEW_TYPE;
  payload: {
    overviewType: OverviewType;
  };
};

type ToggleOverviewType = {
  type: DashboardsTypes.TOGGLE_OVERVIEW_TYPE;
};

type SetCurrentView = {
  type: DashboardsTypes.SET_CURRENT_VIEW;
  payload: {
    currentView: DashboardView;
  };
};

export function setSitesFilter(siteIds: number[]): SetSitesFilter {
  return {
    type: DashboardsTypes.SET_SITES_FILTER,
    payload: {
      siteIds,
    },
  };
}

export function setProductsFilter(productIds: number[]): SetProductsFilter {
  return {
    type: DashboardsTypes.SET_PRODUCTS_FILTER,
    payload: {
      productIds,
    },
  };
}

export function setOverviewType(overviewType: OverviewType): SetOverviewType {
  return {
    type: DashboardsTypes.SET_OVERVIEW_TYPE,
    payload: {
      overviewType,
    },
  };
}

export function toggleOverviewType(): ToggleOverviewType {
  return {
    type: DashboardsTypes.TOGGLE_OVERVIEW_TYPE,
  };
}

export function setCurrentView(currentView: DashboardView): SetCurrentView {
  return {
    type: DashboardsTypes.SET_CURRENT_VIEW,
    payload: {
      currentView,
    },
  };
}
