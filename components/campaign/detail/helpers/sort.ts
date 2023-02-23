import { SiteEmission } from "@custom-types/core/Sites";
import { getTotalUncertainty, getTotalResultTco2 } from "@lib/core/campaign/getTotals";

export enum SortFields {
  NAME,
  RESULT_TCO2,
  STATUS,
  // OWNER
};

export const sortMethods: {
  [sortField in SortFields]: (a: SiteEmission, b: SiteEmission) => number
} = {
  [SortFields.NAME]: (a, b) => {
    return (a.name?.toLowerCase() ?? '') <= (b.name?.toLowerCase() ?? '') ? -1 : 1
  },
  [SortFields.RESULT_TCO2]: (a, b) => {
    return a.tCo2 <= b.tCo2 ? -1 : 1
  },
  [SortFields.STATUS]: (a, b) => {
    return a.nbByStatus.IN_PROGRESS < b.nbByStatus.IN_PROGRESS ? -1 : 1
  },
  // [SortFields.OWNER]: (a, b) => {
  //   return a.resultTco2Downstream <= b.resultTco2Downstream ? -1 : 1
  // },
}