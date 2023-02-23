import { Scope } from "@custom-types/wecount-api/activity";
import { CategoryEmission, PerimetersByEmission } from "@reducers/perimeter/perimeterReducer";

type TotalOfCategories = {
    [categoryId: number]: number;
}

type TotalOfCategoriesInPerimeter = {
    [perimeterId: number]: TotalOfCategories;
}

export const getExcludedTco2 = (category: CategoryEmission, selectedExcludedData: number) => {
    switch (selectedExcludedData)
    {
        case 1:
            return category.tco2Included;

        case 2:
            return category.tco2Excluded;

        case 3:
            return category.tco2Excluded + category.tco2Included;

        default:
            return category.tco2Excluded + category.tco2Included;
    }
}

export const totalCategories = (scope: Scope, perimeters: PerimetersByEmission, selectedExcludedData: number) => {
    let totalOfCategories: TotalOfCategories = {};
    let totalOfCategoriesInPerimeter: TotalOfCategoriesInPerimeter = {};

    Object.values(perimeters).forEach(perimeter => {
        Object.values(perimeter.campaigns).forEach(campaign => {
            if(campaign.scopes !== undefined){
                const scopeCategories = campaign.scopes[scope].categories;
                Object.keys(scopeCategories).forEach(category => {
                    if(scopeCategories !== undefined){
                        if(totalOfCategories[parseInt(category)] === undefined){
                            totalOfCategories[parseInt(category)] = 0;
                        }
                        totalOfCategories[parseInt(category)] += 
                            getExcludedTco2(scopeCategories[parseInt(category)], selectedExcludedData);
                        if(
                            totalOfCategoriesInPerimeter[perimeter.id] === undefined){
                            totalOfCategoriesInPerimeter[perimeter.id] = {
                                [parseInt(category) as number]: 0
                            };
                        }
                        if(totalOfCategoriesInPerimeter[perimeter.id][parseInt(category)] === undefined){
                            totalOfCategoriesInPerimeter[perimeter.id][parseInt(category)] = 0;
                        }
                        totalOfCategoriesInPerimeter[perimeter.id][parseInt(category)] += 
                            getExcludedTco2(scopeCategories[parseInt(category)], selectedExcludedData);
                    }
                });
            }
        });
    });
    return {
        totalOfCategories: totalOfCategories,
        totalOfCategoriesInPerimeter: totalOfCategoriesInPerimeter
    };
}