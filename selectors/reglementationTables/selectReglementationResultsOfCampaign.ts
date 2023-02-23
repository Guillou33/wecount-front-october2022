import { RootState } from "@reducers/index";
import {
  ResultsISO,
  ResultsBEGES,
  ResultsGHG,
} from "@lib/wecount-api/responses/apiResponses";
import { TableType } from "@lib/wecount-api/responses/apiResponses";

function selectReglementationResultsOfCampaign<T extends TableType>(
  state: RootState,
  campaignId: number | undefined,
  tableType: T
): (ResultsISO | ResultsGHG | ResultsBEGES)[] {
  return campaignId == null
    ? []
    : state.reglementationTables.dataByCampaign[campaignId]?.[tableType]
        ?.results ?? [];
}

export default selectReglementationResultsOfCampaign;
