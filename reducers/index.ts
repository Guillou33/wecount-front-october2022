import { combineReducers } from "redux";
import { reducer as reduxFormReducer } from "redux-form";
import authReducer from "@reducers/authReducer";
import listEntriesReducer from "@reducers/entries/listEntriesReducer";
import campaignReducer from "@reducers/campaignReducer";
import activityEditReducer from "@reducers/activity/editReducer";
import coreEmissionFactorReducer from "@reducers/core/emissionFactorReducer";
import coreCategoryReducer from "@reducers/core/categoryReducer";
import coreCustomEmissionFactorReducer from "@reducers/core/customEmissionFactorReducer";
import coreSiteReducer from "@reducers/core/siteReducer";
import coreProductReducer from "@reducers/core/productReducer";
import coreUserReducer from "@reducers/core/userReducer";
import adminCompanyListReducer from "@reducers/admin/companyListReducer";
import profileReducer from "@reducers/profileReducer";
import campaignListingColumnReducer from "@reducers/userPreference/campaignListingReducer";
import campaignDashboardReducer from "@reducers/userPreference/campaignDashboardReducer";
import activityModelPreferenceReducer from "@reducers/userPreference/activityModelsReducer";
import chartNavigationReducer from "@reducers/chartNavigationReducer";
import dashboardsReducer from "@reducers/dashboards/dashboardsReducer";
import campaignTrajectoriesReducer from "@reducers/trajectory/campaignTrajectories/campaignTrajectoriesReducer";
import currentTrajectoryReducer from "@reducers/trajectory/currentTrajectory/currentTrajectoryReducer";
import scopeHelpsReducer from "@reducers/core/scopeHelpsReducer";
import indicatorReducer from "@reducers/indicator/indicatorReducer";
import activityCategoriesPreferencesReducer from "@reducers/userPreference/activityCategoriesReducer";
import readOnlyModeReducer from "@reducers/readOnlyMode/readOnlyModeReducer";
import mainMenuReducer from "@reducers/mainMenu/mainMenuReducer";
import perimeterReducer from "@reducers/perimeter/perimeterReducer";
import trajectorySettingsReducer from "@reducers/trajectory/trajectorySettings/trajectorySettingsReducer";
import filtersReducer from "@reducers/filters/filtersReducer";
import cardExpansionReducer from "@reducers/cardExpansion/cardExpansionReducer";
import campaignEntriesReducer from "@reducers/entries/campaignEntriesReducer";
import reglementationTableReducer from "./reglementationTables/reglementationTableReducer";
import entryTagReducer from "@reducers/core/entryTagReducer";
import entryDataReducer from "@reducers/dataImport/entryDataReducer";
import tableSettingsReducer from "@reducers/dataImport/tableSettingsReducer";
import entryDataSelectionReducer from "@reducers/dataImport/entryDataSelectionReducer";
import emissionFactorChoiceReducer from "@reducers/emissionFactorChoice/emissionFactorChoiceReducer";
import dataFiltersReducer from "@reducers/dataImport/dataFiltersReducer";
import sitesDataReducer from "@reducers/dataImport/sitesDataReducer";
import coreSelectionReducer from "@reducers/core/coreSelectionReducer";

import { AuthTypes } from "@actions/auth/types";

const adminReducers = {
  companyList: adminCompanyListReducer,
};
const coreReducers = {
  category: coreCategoryReducer,
  emissionFactor: coreEmissionFactorReducer,
  site: coreSiteReducer,
  product: coreProductReducer,
  user: coreUserReducer,
  scopeHelps: scopeHelpsReducer,
  entryTag: entryTagReducer,
  customEmissionFactor: coreCustomEmissionFactorReducer
};
const activityReducers = {
  edit: activityEditReducer,
};

const userPreferenceReducers = {
  campaignDashboard: campaignDashboardReducer,
  campaignListing: campaignListingColumnReducer,
  activityModels: activityModelPreferenceReducer,
  activityCategories: activityCategoriesPreferencesReducer,
};

const trajectoryReducers = {
  currentTrajectory: currentTrajectoryReducer,
  campaignTrajectories: campaignTrajectoriesReducer,
  trajectorySettings: trajectorySettingsReducer,
};

const dataImportReducers = {
  entryData: entryDataReducer,
  tableSettings: tableSettingsReducer,
  entryDataSelection: entryDataSelectionReducer,
  dataFilters: dataFiltersReducer,
  sitesData: sitesDataReducer
};

const reducers = {
  form: reduxFormReducer,
  auth: authReducer,
  profile: profileReducer,
  campaign: campaignReducer,
  activity: combineReducers(activityReducers),
  listSelectedEntries: listEntriesReducer,
  core: combineReducers(coreReducers),
  coreSelection: coreSelectionReducer,
  userPreference: combineReducers(userPreferenceReducers),
  chartNavigation: chartNavigationReducer,
  admin: combineReducers(adminReducers),
  dashboards: dashboardsReducer,
  trajectory: combineReducers(trajectoryReducers),
  indicator: indicatorReducer,
  readOnlyMode: readOnlyModeReducer,
  mainMenu: mainMenuReducer,
  perimeter: perimeterReducer,
  filters: filtersReducer,
  cardExpansion: cardExpansionReducer,
  campaignEntries: campaignEntriesReducer,
  reglementationTables: reglementationTableReducer,
  dataImport: combineReducers(dataImportReducers),
  emissionFactorChoice: emissionFactorChoiceReducer,
};

const appReducer = combineReducers(reducers);
const rootReducer = (state: any, action: any) => {
  if (action.type === AuthTypes.LOGOUT_SUCCESS) {
    state = undefined;
  }
  return appReducer(state, action);
};

export type RootState = ReturnType<typeof appReducer>;

export default rootReducer;
