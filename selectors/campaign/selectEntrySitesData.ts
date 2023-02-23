import { EntriesState } from "@reducers/entries/campaignEntriesReducer";
import { RootState } from "@reducers/index";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

const selectEntrySitesData = (
    campaignId: number
) => {
    const currentCampaignEntries = useSelector<RootState, EntriesState>(
        state => state.campaignEntries[campaignId].entries
    );

    currentCampaignEntries
}