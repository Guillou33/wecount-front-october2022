import { Bar } from "react-chartjs-2";
import { Scope } from "@custom-types/wecount-api/activity";
import { CampaignTrajectory } from "@reducers/trajectory/campaignTrajectories/campaignTrajectoriesReducer";
import useAllEntriesInfoTotal from "@hooks/core/activityEntryInfo/useAllEntriesInfoTotal";
import useReductionInfoByScope from "@hooks/core/useReductionInfoByScope";
import { scopesReductionOptions } from "@components/dashboard/campaign/sub/helpers/scopesReductionConfig";
import {
  buildDataChunk,
  DataChunkRecipe,
  ScopeRecipe
} from "@components/dashboard/campaign/sub/ScopesReduction/dataChunkBuilder";
import useNotExcludedEntriesInfoTotal from "@hooks/core/notExcludedActivityEntryInfo/useNotExcludedInfoTotal";
import useReductionInfoByScopeSwitchDefinitionLevers from "@hooks/core/useReductionInfoByScopeSwitchDefinitionLevers";


type ScopeRecipeData = { scopeRecipes: ScopeRecipe[]; remainingTco2: number };

interface Props {
  trajectory: CampaignTrajectory;
}

const ScopesReductionDashboard = ({ trajectory }: Props) => {
  const entryInfoTotal = useNotExcludedEntriesInfoTotal(trajectory.campaignId);
  const reductionInfoByScope = useReductionInfoByScopeSwitchDefinitionLevers(trajectory.id);

  const scopesToHandle = Object.values(Scope).filter(
    scope => reductionInfoByScope[scope].reductionTco2
  );

  const { scopeRecipes, remainingTco2 } = scopesToHandle.reduce(
    (acc, scope) => {
      acc.remainingTco2 += reductionInfoByScope[scope].reductionTco2;
      acc.scopeRecipes.push({
        type: "scope",
        scope,
        scopeReduction: reductionInfoByScope[scope].reductionTco2,
        tco2Start: acc.remainingTco2,
      });
      return acc;
    },
    {
      scopeRecipes: [],
      remainingTco2: entryInfoTotal.tCo2,
    } as ScopeRecipeData
  );


  const recipes: DataChunkRecipe[] = [
    {
      type: "total",
      tco2Toal: entryInfoTotal.tCo2,
    },
    ...scopeRecipes,
    {
      type: "estimation",
      tco2Estimation: remainingTco2,
    },
  ];

  const datasets = recipes.map(buildDataChunk);

  return (
    <Bar
      data={{
        labels: datasets.map(dataset => dataset.label),
        datasets,
      }}
      options={scopesReductionOptions}
    />
  );
};

export default ScopesReductionDashboard;
