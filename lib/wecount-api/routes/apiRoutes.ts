export enum ApiRoutes {
  CAMPAIGN = '/campaigns/:id',
  CAMPAIGN_DUPLICATE = '/campaigns/:id/duplicate',
  CAMPAIGNS = '/campaigns',
  ACTIVITY_CATEGORIES = '/activity-categories',
  CSV_EXPORT = '/campaigns/:campaignId/csv',
  ACTIVITIES_FOR_MULTIPLE_CAMPAIGNS = '/activities',
  ACTIVITIES = '/campaigns/:campaignId/activities',
  ACTIVITY_ENTRIES = '/campaigns/:campaignId/activity-entries',
  ACTIVITY_ENTRY = '/campaigns/:campaignId/activity-entries/:activityEntryId',
  ACTIVITY_ENTRY_HISTORY = '/campaigns/:campaignId/activity-entries/:activityEntryId/reference-history',
  ACTIVITY_ENTRY_SUBMISSION = '/campaigns/:campaignId/activity-entries/:activityEntryId/submit-for-validation',
  ACTIVITY_ENTRY_DUPLICATE = '/campaigns/:campaignId/activity-entries/:activityEntryId/duplicate',
  ACTIVITY_ENTRIES_LIST = '/campaigns/:campaignId/activity-entries/list/submit',
  ACTIVITY_ENTRIES_DELETE = '/campaigns/:campaignId/activity-entries/list/delete',
  COMPUTE_METHODS = '/compute-method',
  USER_FULL = '/user-full',
  USER_LIST = '/user-list',
  MANAGER_USER = '/manager/user/:userId',
  MANAGER_USER_ARCHIVE = '/manager/user/:userId/archive',
  MANAGER_USER_UNARCHIVE = '/manager/user/:userId/unarchive',
  ADMIN_ACCOUNT_CREATION = '/admin/account-creation',
  ADMIN_IMPERSONATE = '/auth/impersonate',
  USER_PREFERENCES_CAMPAIGN_LISTING = "/userPreferences/campaignListing/:campaignId",
  USER_PREFERENCE_ACTIVITY_MODEL_VISIBILITIES = "/userPreferences/activityModel",
  USER_PREFERENCE_ACTIVITY_CATEGORIES = "/userPreferences/activityCategories",
  SITES = '/sites',
  SITE = '/sites/:siteId',
  ARCHIVE_SITE = '/sites/:siteId/archive',
  ARCHIVE_MULTIPLE_SITES = '/sites/archive/multiple',
  UNARCHIVE_SITE = '/sites/:siteId/unarchive',
  PRODUCTS = '/products',
  PRODUCT = '/products/:productId',
  ARCHIVE_PRODUCT = '/products/:productId/archive',
  ARCHIVE_MULTIPLE_PRODUCTS = '/products/archive/multiple',
  UNARCHIVE_PRODUCT = '/products/:productId/unarchive',
  AUTOCOMPLETE_EMISSION_FACTORS = "/compute-method/:computeMethodId/emission-factor/autocomplete",
  COMPANIES_LOAD_MORE_LOCKED = "/companies/locked",
  COMPANIES_LOAD_MORE_UNLOCKED = "/companies/unlocked",
  COMPANIES_LOCK = "/companies/:id/lock",
  COMPANIES_UNLOCK = "/companies/:id/unlock",
  COMPANIES_SET_READ_ONLY_MODE = "/companies/:id/readonlyMode",
  COMPANIES_SEARCH_UNLOCKED = "/companies/unlocked/search",
  COMPANIES_SEARCH_LOCKED = "/companies/locked/search",
  DELETE_CAMPAIGN_ENTRIES = "/campaigns/:id/entries/remove",
  TRAJECTORIES = "/trajectories",
  TRAJECTORY = "/trajectories/:id",
  SCOPE_TARGET = "/trajectories/:id/scope-targets/:scope",
  ACTION_PLANS = "/action-plans",
  ACTION_PLAN = "/action-plans/:id",
  SCOPE_HELPS = "/trajectories/scope-helps",
  INDICATORS = "/indicators",
  INDICATOR = "/indicators/:id",
  INDICATORS_FOR_CAMPAIGN = "/indicators/campaigns/:id",
  PERIMETERS = "/perimeters",
  PERIMETERS_CARTOGRAPHY_SETTINGS = "/perimeters/:id/cartographySettings",
  PERIMETERS_SITES = "/perimeters/:id/sites",
  PERIMETERS_IMPORT_SITES = "/perimeters/:id/import-sites",
  PERIMETERS_PRODUCTS = "/perimeters/:id/products",
  PERIMETERS_CAMPAIGNS = "/perimeters/:id/campaigns",
  PERIMETERS_EMISSIONS_SYNTHESIS = "/perimeters/emissions/synthesis",
  PERIMETER = "/perimeters/:id",
  PERIMETER_TRAJECTORY_SETTINGS = "/perimeters/:id/trajectory-settings",
  PERIMETER_USERS = "/perimeters/:id/users",
  USER_ROLE_WITHIN_PERIMETER = "/perimeters/:id/user-role",
  TRAJECTORY_SETTINGS_SCOPE_TARGETS = "/trajectory-settings/:id/scope-targets/:scope",
  TRAJECTORY_SETTINGS_TARGET_YEAR = "/trajectory-settings/:id/target-year",
  REGLEMENTATION_TABLES_STRUCTURE = "/reglementation-tables/structure",
  REGLEMENTATION_TABLES_DATA = "/reglementation-tables/campaign-data/:campaignId/:tableCode",
  ANALYTICS = "/analytics",
  ANALYTICS_USER_LOGGED = "/analytics/logged",
  PERIMETER_ENTRY_TAGS = "/perimeters/:id/entry-tags",
  ENTRY_TAGS = "/entry-tags",
  ENTRY_TAG = "/entry-tags/:id",
  ARCHIVE_ENTRY_TAG = "/entry-tags/:id/archive",
  UNARCHIVE_ENTRY_TAG = "/entry-tags/:id/unarchive",
  ACCOUNT_CHANGE_LOCALE = "/user/locale",
  CAMPAIGNS_CREATE_MULTIPLE_ENTRIES = "/campaigns/:id/entries/create-multiple",
  CUSTOM_EMISSION_FACTORS = '/custom-emission-factor',
  CUSTOM_EMISSION_FACTOR = '/custom-emission-factor/:cefId',
  ARCHIVE_CUSTOM_EMISSION_FACTOR = '/custom-emission-factor/:cefId/archive',
  UNARCHIVE_CUSTOM_EMISSION_FACTOR = '/custom-emission-factor/:cefId/unarchive',
};

export const generateRoute = (route: ApiRoutes, params: { [key: string]: string | number } = {}): string => {
  if (route.indexOf(':') === -1) {
    return route;
  }

  let generatedRoute: string = route;
  let indexParam = generatedRoute.indexOf(':');
  let i = 0;
  while (indexParam !== -1 && i < 10) {
    i++;

    const fromParam = generatedRoute.substr(generatedRoute.indexOf(':'));
    const indexNextSlash = fromParam.indexOf('/');

    const routePart1 = generatedRoute.substr(0, indexParam);
    let param: string;
    let routePart2: string
    if (indexNextSlash === -1) {
      param = generatedRoute.substr(indexParam + 1);
      routePart2 = '';
    } else {
      param = generatedRoute.substr(indexParam + 1, indexNextSlash - 1);
      routePart2 = generatedRoute.substr(indexParam + indexNextSlash);
    }

    if (!params[param]) {
      throw new Error("Missing param to generate route");
    }

    generatedRoute = `${routePart1}${params[param]}${routePart2}`;

    indexParam = generatedRoute.indexOf(':');
  }

  return generatedRoute;
};
