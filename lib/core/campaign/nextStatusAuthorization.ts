import { CampaignStatus } from "@custom-types/core/CampaignStatus";

export const nextStatusAuthorization: {
  [status in CampaignStatus]: CampaignStatus[]
} = {
  [CampaignStatus.IN_PREPARATION]: [
    CampaignStatus.IN_PROGRESS,
  ],
  [CampaignStatus.IN_PROGRESS]: [
    CampaignStatus.IN_PREPARATION,
    CampaignStatus.CLOSED,
  ],
  [CampaignStatus.CLOSED]: [
    CampaignStatus.ARCHIVED,
    CampaignStatus.IN_PROGRESS,
  ],
  [CampaignStatus.ARCHIVED]: [
    CampaignStatus.CLOSED,
    CampaignStatus.IN_PROGRESS,
  ],
};
