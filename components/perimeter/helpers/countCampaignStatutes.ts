import { CampaignStatus } from "@custom-types/core/CampaignStatus"
import { CampaignEmissions } from "@reducers/perimeter/perimeterReducer"

export const countCampaignStatutes = (
    campaigns: CampaignEmissions, 
    status: CampaignStatus
) => {
    return Object.values(campaigns).filter(campaign => campaign.status === status).length;
}