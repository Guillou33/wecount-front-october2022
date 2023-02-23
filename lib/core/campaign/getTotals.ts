import { CampaignInformation } from "@reducers/campaignReducer";

export const getTotalResultTco2 = (campaignInformation: CampaignInformation): number => {
  return campaignInformation.resultTco2Core + campaignInformation.resultTco2Downstream + campaignInformation.resultTco2Upstream; 
}

export const getTotalUncertainty = (campaignInformation: CampaignInformation): number => {
  const resultTco2 = getTotalResultTco2(campaignInformation);
  
  return !resultTco2 ? 0 :
    (campaignInformation.uncertaintyCore * campaignInformation.resultTco2Core 
    + campaignInformation.uncertaintyDownstream * campaignInformation.resultTco2Downstream 
    + campaignInformation.uncertaintyUpstream * campaignInformation.resultTco2Upstream) / resultTco2;
}