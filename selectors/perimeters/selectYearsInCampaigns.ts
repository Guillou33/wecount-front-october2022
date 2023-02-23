import { RootState } from "@reducers/index";
import { createSelector } from "reselect";

const selectYearsInCampaigns = createSelector(
    [
        (state: RootState) => state.perimeter.emissions,
    ],
    (perimeters) => {
        const years = Object.values(perimeters).map(perimeter => {
            return Object.values(perimeter.campaigns).map(campaign => {
                return campaign.year;
            });
        }).flat();
        const duplicatedRemoved = years.filter((year, index) => !years.includes(year, index + 1));
        return duplicatedRemoved.sort((a, b) => a - b);
    }
);

export default selectYearsInCampaigns;