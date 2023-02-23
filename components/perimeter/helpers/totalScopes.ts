import { Scope } from "@custom-types/wecount-api/activity"
import { formatNumberWithLanguage } from "@lib/translation/config/numbers"
import { roundTwoDecimals, roundValue } from "@lib/utils/calculator"
import { PerimetersByEmission } from "@reducers/perimeter/perimeterReducer";
import { getExcludedTco2 } from './getScopeProps';

export interface PerimeterScopes  {
    [perimeterId: number]: {
        [Scope.UPSTREAM]: {
            emission: number,
            percentage: string
        },
        [Scope.CORE]: {
            emission: number,
            percentage: string
        },
        [Scope.DOWNSTREAM]: {
            emission: number,
            percentage: string
        },
    }
}

export const getTotalScopes = (perimeters: PerimetersByEmission, selectedExcludedData: number) => {
    let totalUpstream = 0;
    let totalCore = 0;
    let totalDownstream = 0;
    Object.values(perimeters).forEach(perimeter => {
        Object.values(perimeter.campaigns).forEach(campaign => {

            totalUpstream += getExcludedTco2(campaign, selectedExcludedData)[Scope.UPSTREAM];
            totalCore += getExcludedTco2(campaign, selectedExcludedData)[Scope.CORE];
            totalDownstream += getExcludedTco2(campaign, selectedExcludedData)[Scope.DOWNSTREAM];
        });
    });
    return {
        [Scope.UPSTREAM]: totalUpstream,
        [Scope.CORE]: totalCore,
        [Scope.DOWNSTREAM]: totalDownstream,
    };
}

export const getTotalScopesOfPerimeters = (perimeters: PerimetersByEmission, selectedExcludedData: number) => {

    return Object.values(perimeters).reduce((acc, perimeter) => {
        let totalUpstream = 0;
        let totalCore = 0;
        let totalDownstream = 0;
        let percentUpstream = 0;
        let percentCore = 0;
        let percentDownstream = 0;
        Object.values(perimeter.campaigns).forEach(campaign => {
            totalUpstream += getExcludedTco2(campaign, selectedExcludedData)[Scope.UPSTREAM];
            totalCore += getExcludedTco2(campaign, selectedExcludedData)[Scope.CORE];
            totalDownstream += getExcludedTco2(campaign, selectedExcludedData)[Scope.DOWNSTREAM];
        });
        Object.values(perimeter.campaigns).forEach(campaign => {
            percentUpstream += (getExcludedTco2(campaign, selectedExcludedData)[Scope.UPSTREAM] / getTotalScopes(perimeters, selectedExcludedData)[Scope.UPSTREAM]) * 100;
            percentCore += (getExcludedTco2(campaign, selectedExcludedData)[Scope.CORE] / getTotalScopes(perimeters, selectedExcludedData)[Scope.CORE]) * 100;
            percentDownstream += (getExcludedTco2(campaign, selectedExcludedData)[Scope.DOWNSTREAM] / getTotalScopes(perimeters, selectedExcludedData)[Scope.DOWNSTREAM]) * 100;
        });
        acc[perimeter.id] = {
            [Scope.UPSTREAM]: {
                emission: totalUpstream,
                percentage: formatNumberWithLanguage(roundValue(percentUpstream))
            },
            [Scope.CORE]: {
                emission: totalCore,
                percentage: formatNumberWithLanguage(roundValue(percentCore))
            },
            [Scope.DOWNSTREAM]: {
                emission: totalDownstream,
                percentage: formatNumberWithLanguage(roundValue(percentDownstream))
            },
        }
        return acc;
    }, {} as PerimeterScopes);
}
