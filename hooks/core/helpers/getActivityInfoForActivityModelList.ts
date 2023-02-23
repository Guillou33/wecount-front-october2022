import { Status, STATUS_WEIGHTS } from '@custom-types/core/Status';
import { ActivityInfo, getInitialActivityInfo } from '@hooks/core/helpers/activityInfo';
import { ActivityModel } from "@reducers/core/categoryReducer";
import { sumResults, sumSitesAndProductsResults } from "@hooks/core/helpers/entriesResults";

export const getActivityInfoForActivityModelList = (
  activityModels: ActivityModel[],
  activityInfoByModelId: { [key: number]: ActivityInfo }
): ActivityInfo => {
  return activityModels.reduce(
    (mapping: ActivityInfo, activityModel) => {
      if (!activityInfoByModelId[activityModel.id]) {
        return mapping;
      }
      mapping.nb += activityInfoByModelId[activityModel.id].nb;
      for (const [status, nbForStatus] of Object.entries(activityInfoByModelId[activityModel.id].nbByStatus)) {
        mapping.nbByStatus[status as Status]! += nbForStatus;
      }
      mapping.hasInProgressStatuses =
        mapping.hasInProgressStatuses ||
        activityInfoByModelId[activityModel.id].hasInProgressStatuses;
      mapping.tCo2 += activityInfoByModelId[activityModel.id].tCo2;
      mapping.targetTco2 += activityInfoByModelId[activityModel.id].targetTco2;

      const mappingStatusWeight = STATUS_WEIGHTS[mapping.status];
      const currentStatusWeight = STATUS_WEIGHTS[activityInfoByModelId[activityModel.id].status];
      if(mappingStatusWeight > currentStatusWeight){
        mapping.status = activityInfoByModelId[activityModel.id].status;
      }

      mapping.tco2BySites = sumResults(
        mapping.tco2BySites,
        activityInfoByModelId[activityModel.id].tco2BySites
      );
      mapping.tco2ByProducts = sumResults(
        mapping.tco2ByProducts,
        activityInfoByModelId[activityModel.id].tco2ByProducts
      );

      mapping.tco2BySitesAndProducts = sumSitesAndProductsResults(
        mapping.tco2BySitesAndProducts,
        activityInfoByModelId[activityModel.id].tco2BySitesAndProducts
      )
      return mapping;
    },
    getInitialActivityInfo(Status.ARCHIVED)
  );
};