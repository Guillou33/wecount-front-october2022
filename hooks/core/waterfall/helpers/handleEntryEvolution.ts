import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";
import { WaterfallData } from "./waterfallData";

type Params = {
  entryOfCampaignOne: ActivityEntryExtended;
  entryOfCampaignTwo: ActivityEntryExtended;
  acc: WaterfallData;
};

function handleEntryEvolution({
  entryOfCampaignOne,
  entryOfCampaignTwo,
  acc,
}: Params) {
  if (entryOfCampaignOne.resultTco2 === 0) {
    acc.otherNewEntries += entryOfCampaignTwo.resultTco2;
  } else if (entryOfCampaignTwo.resultTco2 === 0) {
    acc.otherOldEntries += entryOfCampaignOne.resultTco2;
  } else {
    const feEvolution =
      entryOfCampaignOne.emissionFactor != null &&
      entryOfCampaignTwo.emissionFactor != null
        ? entryOfCampaignTwo.emissionFactor.value /
          entryOfCampaignOne.emissionFactor.value
        : 1;

    const entryEvolutionFromFe =
      entryOfCampaignOne.resultTco2 * feEvolution -
      entryOfCampaignOne.resultTco2;

    const entryEvolutionFromInputs =
      entryOfCampaignTwo.resultTco2 -
      entryEvolutionFromFe -
      entryOfCampaignOne.resultTco2;

    if (entryEvolutionFromFe > 0) {
      acc.feAugmentations += entryEvolutionFromFe;
    } else {
      acc.feReduction += -entryEvolutionFromFe;
    }

    if (entryEvolutionFromInputs > 0) {
      acc.inputsAugmentations += entryEvolutionFromInputs;
    } else {
      acc.inputsReduction += -entryEvolutionFromInputs;
    }
  }
}

export default handleEntryEvolution;
