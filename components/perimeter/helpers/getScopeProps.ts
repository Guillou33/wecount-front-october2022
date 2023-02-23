import { CampaignStatus } from "@custom-types/core/CampaignStatus";
import { CampaignType } from "@custom-types/core/CampaignType";
import { Scope } from "@custom-types/wecount-api/activity"
import { ScopeEmissions } from "@reducers/perimeter/perimeterReducer";
import { t } from "i18next"
import { upperFirst } from "lodash";

export interface CampaignInTable {
    id: number;
    status: CampaignStatus;
    type: CampaignType;
    name: string;
    resultTco2Upstream: number;
    resultTco2Core: number;
    resultTco2Downstream: number;
    resultTco2UpstreamForTrajectory: number;
    resultTco2CoreForTrajectory: number;
    resultTco2DownstreamForTrajectory: number;
    year: number;
    scopes?: ScopeEmissions | undefined;
}

export const getScopeText = (scope: Scope) => {
    const titles = {
        [Scope.UPSTREAM]: upperFirst(t("footprint.scope.upstream")),
        [Scope.CORE]: upperFirst(t("footprint.scope.core")),
        [Scope.DOWNSTREAM]: upperFirst(t("footprint.scope.downstream")),
    }
    return titles[scope];
}

export const getExcludedTco2 = (campaign: CampaignInTable, selectedExcludedData: number) => {
    switch (selectedExcludedData)
    {
        case 1:
            return {
                [Scope.UPSTREAM]: campaign.resultTco2UpstreamForTrajectory,
                [Scope.CORE]: campaign.resultTco2CoreForTrajectory,
                [Scope.DOWNSTREAM]: campaign.resultTco2DownstreamForTrajectory,
            };

        case 2:
            return {
                [Scope.UPSTREAM]: campaign.resultTco2Upstream - campaign.resultTco2UpstreamForTrajectory,
                [Scope.CORE]: campaign.resultTco2Core - campaign.resultTco2CoreForTrajectory,
                [Scope.DOWNSTREAM]: campaign.resultTco2Downstream - campaign.resultTco2DownstreamForTrajectory,
            };

        case 3:
            return {
                [Scope.UPSTREAM]: campaign.resultTco2Upstream,
                [Scope.CORE]: campaign.resultTco2Core,
                [Scope.DOWNSTREAM]: campaign.resultTco2Downstream,
            }

        default:
            return {
                [Scope.UPSTREAM]: campaign.resultTco2Upstream,
                [Scope.CORE]: campaign.resultTco2Core,
                [Scope.DOWNSTREAM]: campaign.resultTco2Downstream,
            }
    }
}

export const getTco2CampaignScope = (scope: Scope, campaign: CampaignInTable, selectedExcludedData: number) => {
    const tco2 = getExcludedTco2(campaign, selectedExcludedData);
    return tco2[scope];
}