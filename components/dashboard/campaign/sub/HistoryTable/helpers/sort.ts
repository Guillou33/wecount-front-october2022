import { EntriesHistory } from "@lib/core/campaignHistory/getHistoryFromEntries";
import { ActivityModelWithCategory } from "@hooks/core/useActivityModelInfo";
import { Site } from "@reducers/core/siteReducer";
import { Product } from "@reducers/core/productReducer";
import getEvolution from "./getEvolution";

export enum SortFields {
  CATEGORY_NAME,
  ACTIVITY_MODEL_NAME,
  ACTIVITY_ENTRY_CODE,
  INPUT_1_CAMPAIGN_1,
  INPUT_1_CAMPAIGN_2,
  INPUT_1_EVOLUTION,
  INPUT_2_CAMPAIGN_1,
  INPUT_2_CAMPAIGN_2,
  INPUT_2_EVOLUTION,
  EMISSION_CAMPAIGN_1,
  EMISSION_CAMPAIGN_2,
  EMISSION_EVOLUTION,
  EMISSION_FACTOR_NAME,
  SITE_NAME,
  PRODUCT_NAME,
}

type SortMethods = {
  [sortField in SortFields]: (a: EntriesHistory, b: EntriesHistory) => number;
};

type GetSortMethodsParams = {
  campaignId1: number;
  campaignId2: number;
  getActivityModel: (id: number | null) => ActivityModelWithCategory | null;
  getSite: (id: number | null) => Site | null;
  getProduct: (id: number | null) => Product | null;
};

const lexicographicOrder = (a: string | undefined, b: string | undefined) => {
  const first = (a ?? "").toLocaleLowerCase();
  const second = (b ?? "").toLocaleLowerCase();
  return first.localeCompare(second);
};

function handleInfinity(value: number): number {
  return isFinite(value) ? value : 0;
}

export function getSortMethods({
  campaignId1,
  campaignId2,
  getActivityModel,
  getSite,
  getProduct,
}: GetSortMethodsParams): SortMethods {
  return {
    [SortFields.CATEGORY_NAME]: (a, b) => {
      const activityModelIdA =
        a.entriesBycampaignId[campaignId1]?.activityModelId ??
        a.entriesBycampaignId[campaignId2]?.activityModelId;
      const activityModelIdB =
        b.entriesBycampaignId[campaignId1]?.activityModelId ??
        b.entriesBycampaignId[campaignId2]?.activityModelId;
      const categoryAName = getActivityModel(activityModelIdA)?.category.name;
      const categoryBName = getActivityModel(activityModelIdB)?.category.name;
      return lexicographicOrder(categoryAName, categoryBName);
    },
    [SortFields.ACTIVITY_MODEL_NAME]: (a, b) => {
      const activityModelIdA =
        a.entriesBycampaignId[campaignId1]?.activityModelId ??
        a.entriesBycampaignId[campaignId2]?.activityModelId;
      const activityModelIdB =
        b.entriesBycampaignId[campaignId1]?.activityModelId ??
        b.entriesBycampaignId[campaignId2]?.activityModelId;
      const activityModelA = getActivityModel(activityModelIdA);
      const activityModelB = getActivityModel(activityModelIdB);
      return lexicographicOrder(activityModelA?.name, activityModelB?.name);
    },
    [SortFields.ACTIVITY_ENTRY_CODE]: (a, b) => {
      const [categoryA = "0", activityA = "0", codeA = ""] =
        a.referenceId.split("-");
      const [categoryB = "0", activityB = "0", codeB = ""] =
        b.referenceId.split("-");

      if (categoryA !== categoryB) {
        return Number(categoryA) - Number(categoryB);
      }
      if (activityA !== activityB) {
        return Number(activityA) - Number(activityB);
      }
      return codeA.localeCompare(codeB);
    },
    [SortFields.INPUT_1_CAMPAIGN_1]: (a, b) => {
      const inputA = a.entriesBycampaignId[campaignId1]?.value ?? 0;
      const inputB = b.entriesBycampaignId[campaignId1]?.value ?? 0;
      return inputA - inputB;
    },
    [SortFields.INPUT_1_CAMPAIGN_2]: (a, b) => {
      const inputA = a.entriesBycampaignId[campaignId2]?.value ?? 0;
      const inputB = b.entriesBycampaignId[campaignId2]?.value ?? 0;
      return inputA - inputB;
    },
    [SortFields.INPUT_1_EVOLUTION]: (a, b) => {
      const inputACampaign1 = a.entriesBycampaignId[campaignId1]?.value ?? 0;
      const inputACampaign2 = a.entriesBycampaignId[campaignId2]?.value ?? 0;
      const evolutionA = getEvolution(inputACampaign1, inputACampaign2);

      const inputBCampaign1 = b.entriesBycampaignId[campaignId1]?.value ?? 0;
      const inputBCampaign2 = b.entriesBycampaignId[campaignId2]?.value ?? 0;
      const evolutionB = getEvolution(inputBCampaign1, inputBCampaign2);

      return handleInfinity(evolutionA) - handleInfinity(evolutionB);
    },
    [SortFields.INPUT_2_CAMPAIGN_1]: (a, b) => {
      const input2A = a.entriesBycampaignId[campaignId1]?.value2 ?? 0;
      const input2B = b.entriesBycampaignId[campaignId1]?.value2 ?? 0;
      return input2A - input2B;
    },
    [SortFields.INPUT_2_CAMPAIGN_2]: (a, b) => {
      const input2A = a.entriesBycampaignId[campaignId2]?.value2 ?? 0;
      const input2B = b.entriesBycampaignId[campaignId2]?.value2 ?? 0;
      return input2A - input2B;
    },
    [SortFields.INPUT_2_EVOLUTION]: (a, b) => {
      const input2ACampaign1 = a.entriesBycampaignId[campaignId1]?.value2 ?? 0;
      const input2ACampaign2 = a.entriesBycampaignId[campaignId2]?.value2 ?? 0;
      const evolutionA = getEvolution(input2ACampaign1, input2ACampaign2);

      const input2BCampaign1 = b.entriesBycampaignId[campaignId1]?.value2 ?? 0;
      const input2BCampaign2 = b.entriesBycampaignId[campaignId2]?.value2 ?? 0;
      const evolutionB = getEvolution(input2BCampaign1, input2BCampaign2);

      return handleInfinity(evolutionA) - handleInfinity(evolutionB);
    },
    [SortFields.EMISSION_CAMPAIGN_1]: (a, b) => {
      const emissionA = a.entriesBycampaignId[campaignId1]?.resultTco2 ?? 0;
      const emissionB = b.entriesBycampaignId[campaignId1]?.resultTco2 ?? 0;
      return emissionA - emissionB;
    },
    [SortFields.EMISSION_CAMPAIGN_2]: (a, b) => {
      const emissionA = a.entriesBycampaignId[campaignId2]?.resultTco2 ?? 0;
      const emissionB = b.entriesBycampaignId[campaignId2]?.resultTco2 ?? 0;
      return emissionA - emissionB;
    },
    [SortFields.EMISSION_EVOLUTION]: (a, b) => {
      const emissionACampaign1 =
        a.entriesBycampaignId[campaignId1]?.resultTco2 ?? 0;
      const emissionACampaign2 =
        a.entriesBycampaignId[campaignId2]?.resultTco2 ?? 0;
      const evolutionA = getEvolution(emissionACampaign1, emissionACampaign2);

      const emissionBCampaign1 =
        b.entriesBycampaignId[campaignId1]?.resultTco2 ?? 0;
      const emissionBCampaign2 =
        b.entriesBycampaignId[campaignId2]?.resultTco2 ?? 0;
      const evolutionB = getEvolution(emissionBCampaign1, emissionBCampaign2);

      return handleInfinity(evolutionA) - handleInfinity(evolutionB);
    },
    [SortFields.EMISSION_FACTOR_NAME]: (a, b) => {
      const emissionFactorA =
        a.entriesBycampaignId[campaignId1]?.emissionFactor?.name;
      const emissionFactorB =
        b.entriesBycampaignId[campaignId1]?.emissionFactor?.name;
      return lexicographicOrder(emissionFactorA, emissionFactorB);
    },
    [SortFields.SITE_NAME]: (a, b) => {
      const siteIdA =
        a.entriesBycampaignId[campaignId1]?.siteId ??
        a.entriesBycampaignId[campaignId2]?.siteId;
      const siteIdB =
        b.entriesBycampaignId[campaignId1]?.siteId ??
        b.entriesBycampaignId[campaignId2]?.siteId;

      return lexicographicOrder(
        getSite(siteIdA)?.name ?? "",
        getSite(siteIdB)?.name ?? ""
      );
    },
    [SortFields.PRODUCT_NAME]: (a, b) => {
      const productIdA =
        a.entriesBycampaignId[campaignId1]?.productId ??
        a.entriesBycampaignId[campaignId2]?.productId ??
        -1;
      const productIdB =
        b.entriesBycampaignId[campaignId1]?.productId ??
        b.entriesBycampaignId[campaignId2]?.productId ??
        -1;

      return lexicographicOrder(
        getProduct(productIdA)?.name ?? "",
        getProduct(productIdB)?.name ?? ""
      );
    },
  };
}
