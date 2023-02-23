import { RootState } from "@reducers/index";
import { createSelector } from "reselect";

const selectAllCampaignsWithEmissions = createSelector(
    [
        (state: RootState) => state.perimeter.emissions
    ],
    (perimeters) => {
        return Object.values(perimeters).map(perimeter => {
            return Object.values(perimeter.campaigns).map(campaign => {
                return {
                    perimeterId: perimeter.id,
                    ...campaign
                };
            });
        }).flat();
    }
);

export default selectAllCampaignsWithEmissions;