import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from "@reducers/index";
import { CampaignIndicators } from "@reducers/indicator/indicatorReducer";
import { requestFetchCampaignIndicators } from "@actions/indicator/indicatorAction";

const useSetOnceCampaignIndicators = (campaignId: number) => {
  const campaignIndicators = useSelector<RootState, CampaignIndicators>(
    state => state.indicator[campaignId]
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (!campaignIndicators?.fetched) {
      dispatch(requestFetchCampaignIndicators(campaignId));
    }
  }, [campaignId, campaignIndicators]);
};

export default useSetOnceCampaignIndicators;
