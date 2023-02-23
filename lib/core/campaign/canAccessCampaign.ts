import { CampaignStatus } from "@custom-types/core/CampaignStatus";
import { PerimeterRole } from "@custom-types/wecount-api/auth"
import { Campaign } from "@reducers/campaignReducer"

export const canAccessCampaign = (campaign: Campaign, rolesGranted: {
  [perimeterRole: string]: boolean
}) => {
  if (rolesGranted[PerimeterRole.PERIMETER_MANAGER]) return true;
  if (campaign.information?.status === CampaignStatus.IN_PREPARATION) {
    return false;
  }
  if (campaign.information?.status === CampaignStatus.CLOSED) {
    return rolesGranted[PerimeterRole.PERIMETER_COLLABORATOR];
  }
  return true;
}