import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from '@reducers/index';
import { CustomThunkDispatch } from '@custom-types/redux'
import { getAllCampaignInformation } from '@actions/campaign/campaignActions';
import useCurrentPerimeter from "@hooks/core/useCurrentPerimeter";

const useSetOnceAllCampaignInfo = (reset: boolean = false) => {
  const allCampaignInformationSet = useSelector<RootState, boolean>(state => state.campaign.allCampaignInformationSet);
  const dispatch = useDispatch() as CustomThunkDispatch;
  const currentPerimeter = useCurrentPerimeter();

  useEffect(() => {
    if (!reset && allCampaignInformationSet || currentPerimeter == null) return;

    dispatch(getAllCampaignInformation(currentPerimeter.id));
  }, [reset, allCampaignInformationSet, currentPerimeter])
};

export default useSetOnceAllCampaignInfo;
