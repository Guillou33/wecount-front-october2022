import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from '@reducers/index';
import { CustomThunkDispatch } from '@custom-types/redux'
import { setProfileInfo } from '@actions/profile/profileActions';

const useSetOnceProfileInfo = () => {
  const allCampaignInformationSet = useSelector<RootState, boolean>(state => state.campaign.allCampaignInformationSet);
  const dispatch = useDispatch() as CustomThunkDispatch;

  useEffect(() => {
    if (allCampaignInformationSet) return;

    dispatch(setProfileInfo());
  }, [])
};

export default useSetOnceProfileInfo;
