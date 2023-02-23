import { CampaignStatus } from "@custom-types/core/CampaignStatus";
import { perimeterRolesHierarchy } from "@lib/core/rolesHierarchy/config";
import { RootState } from "@reducers/index";
import { CampaignEmission } from "@reducers/perimeter/perimeterReducer";
import _ from "lodash";
import { createSelector } from "reselect";

const selectFilteredCampaignsForSynthesis = createSelector(
    [
      (state: RootState) => state.perimeter.emissions,
      (state: RootState) => state.perimeter.synthesis.filter
    ],
    (perimeters, filter) => {

        const setFiltration = (
            campaign: CampaignEmission,
            {
                selection,
                status, 
                years
            }: {
                selection: number[],
                status: CampaignStatus[], 
                years: number[]
            }
        ) => {
            let filtration = true;

            if(status.length > 0){
                filtration = filtration && status.includes(campaign.status);
            }
            if(years.length > 0){
                filtration = filtration && years.includes(campaign.year);
            }
            if(selection.length > 0){
                filtration = filtration && selection.includes(campaign.id);
            }

            return filtration;
        }

        // pas de multiselection par l'user
        if(
            filter.selection.length === 0 &&
            filter.status.length === 0 &&
            filter.years.length === 0
        ){
            return perimeters;
        }
        
        const filteredPerimeters = _.map(perimeters, (perimeter) => {
            const filteredCampaigns = _.pickBy(perimeter.campaigns, (campaign) => {
                // filtrage des campagnes : id, status & année
                return setFiltration({
                    ...campaign, 
                    perimeterId: perimeter.id
                }, filter);
            });
            return {
                [perimeter.id]: {
                    ...perimeter,
                    campaigns: filteredCampaigns
                }
            };
        });

        return _.pickBy(Object.assign({}, ...filteredPerimeters), (perimeter) => {
            return !_.isEmpty(perimeter.campaigns);
        });
    }
);

export default selectFilteredCampaignsForSynthesis;