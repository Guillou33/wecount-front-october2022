export enum Routes {
  LOGIN = '/login',
  // CAMPAIGNS = '/campaigns',
  LOGOUT = '/logout',
  CAMPAIGN = '/campaigns/[id]',
  CAMPAIGN_REPORT = '/campaign-reports/[id]',
};

function routeGenerator(route: Routes) {
  return {
    path: route,
    generate: (id: number): string => route.replace("[id]", id.toString()),
  }
}

export const RouteCampaignGenerator = routeGenerator(Routes.CAMPAIGN);

export const RouteCampaignReportGenerator = routeGenerator(Routes.CAMPAIGN_REPORT);

