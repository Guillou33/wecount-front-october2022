import { Bar } from "react-chartjs-2";
import { Scope } from "@custom-types/wecount-api/activity";
import { CampaignTrajectory } from "@reducers/trajectory/campaignTrajectories/campaignTrajectoriesReducer";
import { scopesReductionOptions } from "@components/dashboard/campaign/sub/helpers/scopesReductionConfig";
import {
  buildDataChunk,
  DataChunkRecipe,
  ScopeRecipe,
} from "./dataChunkBuilder";
import useReductionInfoByScopeForTrajectoryDashboard from "@hooks/core/useReductionInfoByScopeForTrajectoryDashboard";
import useTrajectoryDashboardEntriesInfoTotal from "@hooks/core/trajectoryDashboardEntryInfo/useTrajectoryDashboardEntriesInfoTotal";

type ScopeRecipeData = { scopeRecipes: ScopeRecipe[]; remainingTco2: number };

interface Props {
  trajectory: CampaignTrajectory;
}

const ScopesReductionDashboard = ({ trajectory }: Props) => {
  const entryInfoTotal = useTrajectoryDashboardEntriesInfoTotal(trajectory.campaignId);
  const reductionInfoByScope = useReductionInfoByScopeForTrajectoryDashboard(trajectory.id);

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
      // tco2Estimation: remainingTco2 > 0 ? remainingTco2 : 0,
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
