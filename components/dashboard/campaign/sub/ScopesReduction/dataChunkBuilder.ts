import { DataChunk } from "@components/dashboard/campaign/sub/helpers/scopesReductionConfig";
import { convertToTons } from "@lib/utils/calculator";
import { Scope } from "@custom-types/wecount-api/activity";
import { scopeLabels } from "@components/campaign/detail/trajectory/utils/scopeLabels";
import { upperFirst } from "lodash";
import { t } from "i18next";

export type DataChunkRecipe = TotalRecipe | EstimationRecipe | ScopeRecipe;

export interface TotalRecipe {
  type: "total";
  tco2Toal: number;
}

export interface EstimationRecipe {
  type: "estimation";
  tco2Estimation: number;
}

export interface ScopeRecipe {
  type: "scope";
  scope: Scope;
  scopeReduction: number;
  tco2Start: number;
}

function buildDataChunk(
  recipe: DataChunkRecipe,
  index: number,
  recipes: DataChunkRecipe[]
) {
  const dataLength = recipes.length;
  switch (recipe.type) {
    case "total": {
      return buildTotalDataChunk(recipe, index, dataLength);
    }
    case "scope": {
      return buildScopeDataChunk(recipe, index, dataLength);
    }
    case "estimation": {
      return buildEstimationDataChunk(recipe, index, dataLength);
    }
  }
}

function buildTotalDataChunk(
  recipe: TotalRecipe,
  index: number,
  dataLength: number
): DataChunk {
  return {
    label: upperFirst(t("footprint.emission.ghgTotal")),
    backgroundColor: "#5065C0",
    data: getFormatedData(convertToTons(recipe.tco2Toal), index, dataLength),
  };
}

function buildScopeDataChunk(
  recipe: ScopeRecipe,
  index: number,
  dataLength: number
): DataChunk {
  const scopeReductionRange = getScopeRangeData(
    recipe.scopeReduction,
    recipe.tco2Start
  ).map(convertToTons);

  return {
    label: scopeLabels[recipe.scope],
    backgroundColor: "#92CFA7",
    data: getFormatedData(scopeReductionRange, index, dataLength),
    minBarLength: 3,
    datalabels: {
      anchor: "start",
      align: "bottom",
    },
    labelValue: convertToTons(recipe.scopeReduction),
  };
}

function buildEstimationDataChunk(
  recipe: EstimationRecipe,
  index: number,
  dataLength: number
): DataChunk {
  return {
    label: `${upperFirst(t("trajectory.projection.actionPlan.estimation"))}`,
    backgroundColor: "#B6D1FF",
    data: getFormatedData(
      convertToTons(recipe.tco2Estimation),
      index,
      dataLength
    ),
  };
}

function getFormatedData(value: any, position: number, length: number) {
  const array = new Array(length).fill(null);
  array[position] = value;
  return array;
}

function getScopeRangeData(
  reduction: number,
  startFrom: number
): [number, number] {
  return [startFrom - reduction, startFrom];
}

export { buildDataChunk };
