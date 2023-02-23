export enum CampaignStatus {
  IN_PREPARATION = "IN_PREPARATION",
  IN_PROGRESS = "IN_PROGRESS",
  CLOSED = "CLOSED",
  ARCHIVED = "ARCHIVED",
}

export type nbrCampaignStatuses = {
  [CampaignStatus.ARCHIVED]: number;
  [CampaignStatus.CLOSED]: number;
  [CampaignStatus.IN_PREPARATION]: number;
  [CampaignStatus.IN_PROGRESS]: number;
}