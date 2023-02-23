import { createSelector } from "reselect";

import { RootState } from "@reducers/index";

import { EmissionFactor } from "@reducers/campaignReducer";
import selectActivityEntriesOfCampaign from "@selectors/activityEntries/selectActivityEntriesOfCampaign";

const selectEmissionFactorUsedByCampaign = createSelector(
  selectActivityEntriesOfCampaign,
  entries => {
    const emissionFactors: Record<number, EmissionFactor> = {};

    for (let entry of entries ?? []) {
      const emissionFactor = entry.emissionFactor;
      if (
        emissionFactor != null &&
        emissionFactors[emissionFactor.id] == null
      ) {
        emissionFactors[emissionFactor.id] = emissionFactor;
      }
    }

    return emissionFactors;
  }
);

export default selectEmissionFactorUsedByCampaign;
