import { CampaignInformation } from "@reducers/campaignReducer";

export const getTotalResultTco2ForTrajectory = (campaignInformation: CampaignInformation): number => {

  return campaignInformation.resultTco2CoreForTrajectory + campaignInformation.resultTco2DownstreamForTrajectory + campaignInformation.resultTco2UpstreamForTrajectory; 
}

export const getTotalUncertaintyForTrajectory = (campaignInformation: CampaignInformation): number => {
  const resultTco2ForTrajectory = getTotalResultTco2ForTrajectory(campaignInformation);
  
  return !resultTco2ForTrajectory ? 0 :
    (campaignInformation.uncertaintyCoreForTrajectory * campaignInformation.resultTco2CoreForTrajectory
    + campaignInformation.uncertaintyDownstreamForTrajectory * campaignInformation.resultTco2DownstreamForTrajectory 
    + campaignInformation.uncertaintyUpstreamForTrajectory * campaignInformation.resultTco2UpstreamForTrajectory) / resultTco2ForTrajectory;
}