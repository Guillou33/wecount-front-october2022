import { initCurrentData } from "@actions/emissionFactorChoice/emissionFactorChoiceActions";
import { EntryData } from "@reducers/entries/campaignEntriesReducer";
import { RootState } from "@reducers/index";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useInitCurrentData = () => {
  const dispatch = useDispatch();
  const campaignId = useSelector<RootState, number>(
    (state) => state.campaign.currentCampaign!
  );
  const entryKey = useSelector<RootState, string>(
    (state) => state.emissionFactorChoice.entryKey!
  );
  const entryData = useSelector<RootState, EntryData>(
    (state) => state.campaignEntries[campaignId]!.entries[entryKey]?.entryData
  );

  useEffect(() => {
    if (entryKey) {
      dispatch(
        initCurrentData({
          computeMethodType: entryData.computeMethodType,
          computeMethodId: entryData.computeMethodId ?? undefined,
          emissionFactor: entryData.emissionFactor ?? undefined,
          activityModelId: entryData.activityModelId ?? undefined,
        })
      );
    }
  }, [entryKey]);
};
