import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@reducers/index";

import { TableType } from "@lib/wecount-api/responses/apiResponses";

import { reglementationTableCampaignDataFetchRequested } from "@actions/reglementationTables/reglementationTablesActions";

function useSetOnceReglementationTableCampaignData(
  campaignId: number,
  tableType: TableType
) {
  const dispatch = useDispatch();

  const isFetched = useSelector<RootState, boolean>(
    state =>
      state.reglementationTables.dataByCampaign[campaignId]?.[tableType]
        ?.isFetched
  );
  const isFetching = useSelector<RootState, boolean>(
    state =>
      state.reglementationTables.dataByCampaign[campaignId]?.[tableType]
        ?.isFetching
  );

  const hasError = useSelector<RootState, boolean>(
    state =>
      state.reglementationTables.dataByCampaign[campaignId]?.[tableType]
        ?.hasError
  );

  useEffect(() => {
    if (!isFetched && !isFetching && !hasError) {
      dispatch(
        reglementationTableCampaignDataFetchRequested({ campaignId, tableType })
      );
    }
  }, [isFetched, isFetching, hasError, campaignId, tableType]);
}

export default useSetOnceReglementationTableCampaignData;
