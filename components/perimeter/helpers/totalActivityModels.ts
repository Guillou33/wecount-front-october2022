import { Scope } from "@custom-types/wecount-api/activity";
import { ActivityModelEmission, PerimetersByEmission } from "@reducers/perimeter/perimeterReducer";

type TotalOfActivityModels = {
    [activityModelId: number]: number;
}

type TotalOfActivityModelsInPerimeter = {
    [perimeterId: number]: TotalOfActivityModels;
}

export const getExcludedTco2 = (activityModel: ActivityModelEmission, selectedExcludedData: number) => {
    switch (selectedExcludedData)
    {
        case 1:
            return activityModel.tco2Included;

        case 2:
            return activityModel.tco2Excluded;

        case 3:
            return activityModel.tco2Excluded + activityModel.tco2Included;

        default:
            return activityModel.tco2Excluded + activityModel.tco2Included;
    }
}

export const totalActivityModels = (scope: Scope, perimeters: PerimetersByEmission, selectedExcludedData: number) => {
    let totalOfActivityModels: TotalOfActivityModels = {};
    let totalOfActivityModelsInPerimeter: TotalOfActivityModelsInPerimeter = {};

    Object.values(perimeters).forEach(perimeter => {
        Object.values(perimeter.campaigns).forEach(campaign => {
            if(campaign.scopes !== undefined){
                const scopeCategories = campaign.scopes[scope].categories;
                Object.keys(scopeCategories).forEach(category => {
                    if(scopeCategories !== undefined && campaign.scopes !== undefined){
                        const scopeActivityModels = campaign.scopes[scope].categories[parseInt(category)].activityModels;
                        Object.keys(scopeActivityModels).forEach(activityModel => {
                            if(totalOfActivityModels[parseInt(activityModel)] === undefined){
                                totalOfActivityModels[parseInt(activityModel)] = 0;
                            }
                            totalOfActivityModels[parseInt(activityModel)] += 
                                getExcludedTco2(scopeActivityModels[parseInt(activityModel)], selectedExcludedData);
                            if(
                                totalOfActivityModelsInPerimeter[perimeter.id] === undefined){
                                totalOfActivityModelsInPerimeter[perimeter.id] = {
                                    [parseInt(activityModel) as number]: 0
                                };
                            }
                            if(totalOfActivityModelsInPerimeter[perimeter.id][parseInt(activityModel)] === undefined){
                                totalOfActivityModelsInPerimeter[perimeter.id][parseInt(activityModel)] = 0;
                            }
                            totalOfActivityModelsInPerimeter[perimeter.id][parseInt(activityModel)] += 
                                getExcludedTco2(scopeActivityModels[parseInt(activityModel)], selectedExcludedData);
                        });
                    }
                });
            }
        });
    });
    return {
        totalOfActivityModels: totalOfActivityModels,
        totalOfActivityModelsInPerimeter: totalOfActivityModelsInPerimeter
    };
};