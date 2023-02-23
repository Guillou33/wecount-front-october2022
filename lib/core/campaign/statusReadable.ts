import { CampaignStatus } from "@custom-types/core/CampaignStatus";
import { t } from "i18next";

export const statusReadable = (status: CampaignStatus): string => {
  let statusText: string;
  switch (status) {
    case CampaignStatus.ARCHIVED:
      statusText = t("campaign.status.archived")
      break;
    case CampaignStatus.CLOSED:
      statusText = t("campaign.status.closed")
      break;
    case CampaignStatus.IN_PREPARATION:
      statusText = t("campaign.status.inPreparation")
      break;
    case CampaignStatus.IN_PROGRESS:
      statusText = t("campaign.status.inProgress")
      break;
  
    default:
      statusText = t("campaign.status.inProgress")
      break;
  }

  return statusText;
};
