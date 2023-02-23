import { CampaignInformation } from "@reducers/campaignReducer";
import { getTotalUncertainty, getTotalResultTco2 } from "@lib/core/campaign/getTotals";
import { CampaignTypes } from "@actions/campaign/types";
import { CampaignType } from "@custom-types/core/CampaignType";
import { CampaignStatus } from "@custom-types/core/CampaignStatus";
import { getTotalResultTco2ForTrajectory, getTotalUncertaintyForTrajectory } from "@lib/core/campaign/getTotalsForTrajectory";

export enum SortFields {
  NAME,
  TYPE,
  STATUS,
  REFERENCE_YEAR,
  RESULT_TCO2,
  UNCERTAINTY,
  RESULT_TCO2_FOR_TRAJECTORY,
  UNCERTAINTY_FOR_TRAJCTORY,
  UPSTREAM,
  CORE,
  DOWNSTREAM,
};

const statusOrder = [CampaignStatus.IN_PREPARATION, CampaignStatus.IN_PREPARATION, CampaignStatus.CLOSED, CampaignStatus.ARCHIVED];

export const sortMethods: {
  [sortField in SortFields]: (a: CampaignInformation, b: CampaignInformation) => number
} = {
  [SortFields.NAME]: (a, b) => {
    return (a.name?.toLowerCase() ?? '') <= (b.name?.toLowerCase() ?? '') ? -1 : 1
  },
  [SortFields.TYPE]: (a, b) => {
    return a.type === CampaignType.CARBON_FOOTPRINT ? -1 : 1
  },
  [SortFields.STATUS]: (a, b) => {
    return statusOrder.indexOf(a.status) <= statusOrder.indexOf(b.status) ? -1 : 1
  },
  [SortFields.REFERENCE_YEAR]: (a, b) => {
    if (!a.year) {
      return -1;
    }
    if (!b.year) {
      return 1;
    }
    return a.year <= b.year ? -1 : 1
  },
  [SortFields.RESULT_TCO2]: (a, b) => {
    return getTotalResultTco2(a) <= getTotalResultTco2(b) ? -1 : 1
  },
  [SortFields.UNCERTAINTY]: (a, b) => {
    return getTotalUncertainty(a) <= getTotalUncertainty(b) ? -1 : 1
  },
  [SortFields.RESULT_TCO2_FOR_TRAJECTORY]: (a, b) => {
    return getTotalResultTco2ForTrajectory(a) <= getTotalResultTco2ForTrajectory(b) ? -1 : 1
  },
  [SortFields.UNCERTAINTY_FOR_TRAJCTORY]: (a, b) => {
    return getTotalUncertaintyForTrajectory(a) <= getTotalUncertaintyForTrajectory(b) ? -1 : 1
  },
  [SortFields.UPSTREAM]: (a, b) => {
    return a.resultTco2Upstream <= b.resultTco2Upstream ? -1 : 1
  },
  [SortFields.CORE]: (a, b) => {
    return a.resultTco2Core <= b.resultTco2Core ? -1 : 1
  },
  [SortFields.DOWNSTREAM]: (a, b) => {
    return a.resultTco2Downstream <= b.resultTco2Downstream ? -1 : 1
  },
}