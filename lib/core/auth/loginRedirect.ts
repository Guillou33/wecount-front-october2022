import { Routes, RouteCampaignGenerator } from '@custom-types/core/routes';
import { ResponseCampaigns } from '@lib/wecount-api/responses/apiResponses';
import { ApiRoutes, generateRoute } from '@lib/wecount-api/routes/apiRoutes';
import ApiClient from '@lib/wecount-api/ApiClient';

export const loginRedirect = async (apiClient: ApiClient): Promise<{ path: string; as: string; }> => {
  const campaigns = await apiClient.get<ResponseCampaigns>(generateRoute(ApiRoutes.CAMPAIGNS));

  if (campaigns.data.length) {
    const oldestCampaigns = campaigns.data.reduce((prevCampaign, currentCampaign) => {
      return new Date(currentCampaign.createdAt) > new Date(prevCampaign.createdAt) ? currentCampaign : prevCampaign;
    });
    return {
      path: Routes.CAMPAIGN,
      as: RouteCampaignGenerator.generate(oldestCampaigns.id),
    }
  }

  return {
    path: "/no-perimeters",
    as: "/no-perimeters",
  }
};
