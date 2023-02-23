import { RootState } from "@reducers/index";
import { createSelector } from "reselect";

const selectCampaignsInStatusesAndYears = createSelector(
    [
        (state: RootState) => state.perimeter.emissions,
        (state: RootState) => state.perimeter.synthesis.filter,
    ],
    (perimeters, {status, years}) => {
        const allCampaigns = Object.values(perimeters).map(perimeter => {
            return Object.values(perimeter.campaigns).map(campaign => {
                return {
                    perimeterId: perimeter.id,
                    ...campaign
                };
            });
        }).flat();

        let campaigns = allCampaigns;
        if(status.length > 0){
            campaigns = campaigns.filter(campaign => status.includes(campaign.status));
        }
        if(years.length > 0){
            campaigns = campaigns.filter(campaign => years.includes(campaign.year));
        }

        return campaigns;
    }
);

export default selectCampaignsInStatusesAndYears;