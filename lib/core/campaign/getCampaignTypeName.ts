import { CampaignType } from "@custom-types/core/CampaignType";
import { t } from "i18next";
import { upperFirst } from "lodash";

export const getCampaignTypeName = (campaignType: CampaignType) => {
  switch (campaignType) {
    case CampaignType.CARBON_FOOTPRINT: {
      return upperFirst(t("footprint.carbon"));
    }
    case CampaignType.SIMULATION: {
      return upperFirst(t("footprint.simulation"));
    }
    case CampaignType.DRAFT: {
      return upperFirst(t("footprint.draft"));
    }
  }
};
export const getCampaignTypeShortName = (campaignType: CampaignType) => {
  switch (campaignType) {
    case CampaignType.CARBON_FOOTPRINT: {
      return upperFirst(t("footprint.shortNames.carbon"));
    }
    case CampaignType.SIMULATION: {
      return upperFirst(t("footprint.shortNames.simulation"));
    }
    case CampaignType.DRAFT: {
      return upperFirst(t("footprint.shortNames.draft"));
    }
  }
};
