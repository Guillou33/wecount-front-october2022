import { Activity } from "@reducers/campaignReducer";
import { Status, STATUS_WEIGHTS } from "@custom-types/core/Status";
import {
  ActivityInfo,
  getInitialActivityInfo,
} from "@hooks/core/helpers/activityInfo";
import _ from "lodash";
import { getXPercentOf } from "@lib/utils/calculator";
import {
  getActivityEntriesResultsBy,
  sumResults,
  getActivityEntriesResultBySitesAndProducts,
  sumSitesAndProductsResults,
} from "@hooks/core/helpers/entriesResults";
import { SiteList } from "@reducers/core/siteReducer";
import { ProductList } from "@reducers/core/productReducer";
import Memoize from "@lib/utils/Memoize";

const getActivityInfoByModelId = (
  activities: { [key: number]: Activity } | undefined,
  siteList: SiteList,
  productList: ProductList
): { [key: number]: ActivityInfo } => {
  if (!activities) {
    return {};
  }
  const activityNbByModelId = Object.values(activities).reduce(
    (mapping: { [key: number]: ActivityInfo }, activity: Activity) => {
      const modelId = activity.activityModelId;
      if (!(modelId in mapping)) {
        // Initialize
        mapping[modelId] = getInitialActivityInfo(activity.status);
      }
      mapping[modelId].nb++;
      mapping[modelId].nbByStatus[activity.status]!++;
      mapping[modelId].hasInProgressStatuses =
        mapping[modelId].hasInProgressStatuses ||
        [Status.IN_PROGRESS, Status.TO_VALIDATE].indexOf(activity.status) !==
        -1;

      mapping[modelId].tCo2 =
        mapping[modelId].tCo2 + getResultTCo2ToAdd(activity);
      mapping[modelId].targetTco2 +=
        getResultTCo2ToAdd(activity) -
        getXPercentOf(activity.reductionTarget, activity.resultTco2);

      const mappingStatusWeight = STATUS_WEIGHTS[mapping[modelId].status];
      const currentStatusWeight = STATUS_WEIGHTS[activity.status];
      if (mappingStatusWeight > currentStatusWeight) {
        mapping[modelId].status = activity.status;
      }

      const activitySitesResults = getActivityEntriesResultsBy(
        "siteId",
        activity.activityEntries,
        siteList
      );
      const activityProductsResults = getActivityEntriesResultsBy(
        "productId",
        activity.activityEntries,
        productList
      );
      const activitySitesAndProductsResults =
        getActivityEntriesResultBySitesAndProducts(activity.activityEntries);
      mapping[modelId].tco2BySites = sumResults(
        mapping[modelId].tco2BySites,
        activitySitesResults
      );
      mapping[modelId].tco2ByProducts = sumResults(
        mapping[modelId].tco2ByProducts,
        activityProductsResults
      );
      mapping[modelId].tco2BySitesAndProducts = sumSitesAndProductsResults(
        mapping[modelId].tco2BySitesAndProducts,
        activitySitesAndProductsResults
      );

      return mapping;
    },
    {}
  );
  return activityNbByModelId;
};

const getResultTCo2ToAdd = (activity: Activity) => {
  if ([Status.ARCHIVED].indexOf(activity.status) !== -1) {
    return 0;
  }

  return activity.resultTco2 || 0;
};

const getMemoizedInstance = _.memoize(
  (activities: { [key: number]: Activity } | undefined) =>
    new Memoize(getActivityInfoByModelId)
);

export function memoizedActivityInfoByActivityModel(
  activities: { [key: number]: Activity } | undefined,
  siteList: SiteList,
  productList: ProductList
) {
  return getMemoizedInstance(activities).execute(
    activities,
    siteList,
    productList
  );
}
