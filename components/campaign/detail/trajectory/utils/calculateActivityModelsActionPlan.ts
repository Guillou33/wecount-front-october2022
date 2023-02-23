import { ReductionInfoByActivityModel } from "@hooks/core/helpers/getReductionInfoByActivityModel";
import { roundTwoDecimals } from "@lib/utils/calculator";
import { ActivityModel } from "@reducers/core/categoryReducer";
import { ActivityModelActionPlan } from "@reducers/trajectory/campaignTrajectories/campaignTrajectoriesReducer";
import _ from "lodash";

export const getLengthOfCategoryActionPlansWithActivityModels = (activityModelsActionPlans: ActivityModelActionPlan[]) => {
    let nbrActionPlans = 0;
    if (activityModelsActionPlans.length > 0) {
        activityModelsActionPlans.forEach(activityModel => {
            nbrActionPlans += Object.values(activityModel)[0].length;
        });
    }
    return roundTwoDecimals(nbrActionPlans);
}

export const getTotalReductionActionPlansInActivityModelsInCategory = (
    activityModelReductionsInfo: ReductionInfoByActivityModel,
    activityModelsInCategory: ActivityModel[]
) => {
    const activityModelIds = activityModelsInCategory.map(activityModel => activityModel.id);

    // Pick Reductions for Activtiy Models included in the category
    const activityModelReductionsInfoInCategory = _.pickBy(activityModelReductionsInfo, (reduction, key) => {
        return activityModelIds.includes(parseInt(key));
    });
    let nbrReductionActionPlans = 0;
    if (Object.values(activityModelReductionsInfoInCategory).length > 0) {
        Object.values(activityModelReductionsInfoInCategory).forEach(reduction => {
            nbrReductionActionPlans += reduction.reductionPercentageOfScope ? reduction.reductionPercentageOfScope : 0;
        });
    }
    return roundTwoDecimals(nbrReductionActionPlans);
}