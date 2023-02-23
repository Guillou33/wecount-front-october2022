import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from "@reducers/index";
import { CampaignIndicators } from "@reducers/indicator/indicatorReducer";
import { requestCreateDefaultIndicators } from "@actions/indicator/indicatorAction";
import { isEmpty } from "lodash";

const useSetOnceCampaignIndicators = (campaignId: number) => {
  const campaignIndicators = useSelector<RootState, CampaignIndicators>(
    state => state.indicator[campaignId]
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (campaignIndicators?.fetched && isEmpty(campaignIndicators.indicators)) {
      dispatch(requestCreateDefaultIndicators(campaignId));
    }
  }, [campaignId, campaignIndicators]);
};

export default useSetOnceCampaignIndicators;
